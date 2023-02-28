package web.varlamov.hicam.rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.varlamov.hicam.entity.DeviceConnection;
import web.varlamov.hicam.entity.UserDetailsImpl;
//import web.varlamov.hicam.repository.DeviceConnectionRepository;
import web.varlamov.hicam.repository.UserDetailsRepository;

@RestController
@RequestMapping("/connect")
public class ConnectionRestController {
  @Autowired
  UserDetailsRepository userDetailsRepository;
//  @Autowired
//  DeviceConnectionRepository deviceConnectionRepository;

  @GetMapping("/{token}")
  public void connect(HttpServletResponse httpServletResponse, HttpServletRequest request) {
    httpServletResponse.setHeader("Location", "/device");
    httpServletResponse.setStatus(302);
  }
}
