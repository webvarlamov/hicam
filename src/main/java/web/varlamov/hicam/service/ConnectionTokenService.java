package web.varlamov.hicam.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import web.varlamov.hicam.entity.UserDetailsImpl;

@Service
public class ConnectionTokenService {
  public String getConnectionTokenAsLinkFor(UserDetailsImpl userDetails, HttpServletRequest request) {
    String token = userDetails.getUsername();
    String protocol = request.isSecure() ? "https://": "http://";
    String host = request.getServerName();
    String port = host.equals("localhost") ? ":" + request.getServerPort() : "";
    return protocol + host + port + "/connect/" + token;
  }
}

