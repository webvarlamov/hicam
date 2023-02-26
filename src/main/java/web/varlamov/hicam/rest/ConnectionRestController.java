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
import web.varlamov.hicam.repository.DeviceConnectionRepository;
import web.varlamov.hicam.repository.UserDetailsRepository;
import web.varlamov.hicam.utils.HttpUtils;

@RestController
@RequestMapping("/connect")
public class ConnectionRestController {
  @Autowired
  UserDetailsRepository userDetailsRepository;
  @Autowired
  DeviceConnectionRepository deviceConnectionRepository;

  @GetMapping("/{token}")
  public void connect(@PathVariable String token, HttpServletResponse httpServletResponse, HttpServletRequest request, Authentication authentication) {
    String username = (String) authentication.getPrincipal();
    UserDetailsImpl userDetails = userDetailsRepository.findByUsername(username);
    DeviceConnection deviceConnection = new DeviceConnection(LocalDateTime.now(), userDetails);
    deviceConnectionRepository.save(deviceConnection);

    httpServletResponse.setHeader("Location", "/device/" + deviceConnection.getId());
    httpServletResponse.setStatus(302);
  }
}
