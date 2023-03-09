package web.varlamov.hicam.rest;

import com.google.zxing.WriterException;
import java.io.IOException;
import java.util.List;
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
import web.varlamov.hicam.entity.DeviceSession;
import web.varlamov.hicam.entity.UserDetailsImpl;
import web.varlamov.hicam.repository.UserDetailsRepository;
import web.varlamov.hicam.service.ConnectionTokenService;
import web.varlamov.hicam.service.QRCodeService;
import web.varlamov.hicam.websocket.WebSocketSessionHolderService;

@RestController
@RequestMapping("/admin_api")
public class AdminRestController {
  @Autowired
  QRCodeService qrCodeService;
  @Autowired
  ConnectionTokenService connectionTokenService;
  @Autowired
  WebSocketSessionHolderService webSocketSessionHolderService;
  @Autowired
  UserDetailsRepository userDetailsRepository;

  @RequestMapping("/get_device_sessions")
  public List<DeviceSession> getDeviceSessions(Authentication authentication) {
    String name = authentication.getName();
    UserDetailsImpl userDetails  = userDetailsRepository.findByUsername(name);

    return webSocketSessionHolderService.getDeviceWebSocketSessionWrappers(userDetails.getId())
        .stream()
        .map(webSocketSessionWrapper ->
            new DeviceSession(
                webSocketSessionWrapper.getDeviceId(),
                webSocketSessionWrapper.getDeviceSessionId(),
                webSocketSessionWrapper.getDeviceType())
        ).toList();
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
