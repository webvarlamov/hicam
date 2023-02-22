package web.varlamov.hicam.rest;

import com.google.zxing.WriterException;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.varlamov.hicam.entity.UserDetailsImpl;
import web.varlamov.hicam.service.ConnectionTokenService;
import web.varlamov.hicam.service.QRCodeService;

@RestController
@RequestMapping("/connection_token")
public class ConnectionTokenController {
  @Autowired
  QRCodeService qrCodeService;
  @Autowired
  ConnectionTokenService connectionTokenService;

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
