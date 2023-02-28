package web.varlamov.hicam.rest;

import com.google.zxing.WriterException;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.WebSocketSession;
import web.varlamov.hicam.entity.DeviceConnection;
import web.varlamov.hicam.entity.UserDetailsImpl;
//import web.varlamov.hicam.repository.DeviceConnectionRepository;
import web.varlamov.hicam.repository.UserDetailsRepository;
import web.varlamov.hicam.service.ConnectionTokenService;
import web.varlamov.hicam.service.QRCodeService;
import web.varlamov.hicam.websocket.WebRtcOfferHolderService;
import web.varlamov.hicam.websocket.WebRtcOfferWrapper;
import web.varlamov.hicam.websocket.WebSocketSessionHolderService;
import web.varlamov.hicam.websocket.WebSocketSessionWrapper;

@RestController
@RequestMapping("/admin_api")
public class AdminRestController {
  @Autowired
  QRCodeService qrCodeService;
  @Autowired
  ConnectionTokenService connectionTokenService;
  @Autowired
  WebRtcOfferHolderService webRtcOfferHolderService;
  @Autowired
  WebSocketSessionHolderService webSocketSessionHolderService;
  @Autowired
  UserDetailsRepository userDetailsRepository;

  @RequestMapping("/get_device_connections")
  public Map<String, DeviceConnection> getDeviceConnectionList(Authentication authentication) {
    String name = authentication.getName();
    UserDetailsImpl userDetails  = userDetailsRepository.findByUsername(name);

    List<WebSocketSessionWrapper> webSocketSessionWrappers = webSocketSessionHolderService.getDeviceWebSocketSessionWrappers(userDetails.getId());
    List<DeviceConnection> deviceConnections = Optional.ofNullable(webSocketSessionWrappers).map(
        wrappers -> wrappers.stream()
            .map(wrapper -> new DeviceConnection(
                wrapper.getDeviceConnectionId(),
                wrapper.getDeviceConnectionType(),
                Optional.ofNullable(webRtcOfferHolderService.getWebRtcOfferWrapper(userDetails.getId(), wrapper.getDeviceConnectionId()))
                    .map(WebRtcOfferWrapper::getWebRtcOffer)
                    .orElse(null)
            ))
            .toList()
    ).orElse(Collections.emptyList());

    Map<String, DeviceConnection> result = new HashMap<>();
    deviceConnections.forEach(deviceConnection -> {
      result.put(deviceConnection.getDeviceConnectionId(), deviceConnection);
    });

    return result;
  }

  @RequestMapping("/remove_device_connection_by_id")
  public void removeDeviceConnectionById(@AuthenticationPrincipal UserDetailsImpl userDetails) {

  }

  @GetMapping("/generate_token_link")
  public ResponseEntity<byte[]> generate(@AuthenticationPrincipal UserDetailsImpl user) throws WriterException, IOException {
    return ResponseEntity.status(HttpStatus.OK)
        .header(HttpHeaders.CONTENT_DISPOSITION, "filename=\"image.png\"")
        .contentType(MediaType.IMAGE_PNG)
        .body(qrCodeService.getQRCodeByteArray(
            connectionTokenService.getConnectionTokenAsLinkFor(user)
        ));
  }
}
