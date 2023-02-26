package web.varlamov.hicam.rest;

import com.google.zxing.WriterException;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.varlamov.hicam.entity.DeviceConnection;
import web.varlamov.hicam.entity.UserDetailsImpl;
import web.varlamov.hicam.repository.DeviceConnectionRepository;
import web.varlamov.hicam.service.ConnectionTokenService;
import web.varlamov.hicam.service.QRCodeService;

@RestController
@RequestMapping("/admin_api")
public class AdminRestController {
  @Autowired
  DeviceConnectionRepository deviceConnectionRepository;
  @Autowired
  QRCodeService qrCodeService;
  @Autowired
  ConnectionTokenService connectionTokenService;

  @RequestMapping("/get_device_connection_list")
  public List<DeviceConnection> getDeviceConnectionList(@AuthenticationPrincipal UserDetailsImpl userDetails) {
    return deviceConnectionRepository.getDeviceConnectionByUserDetails(userDetails);
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
