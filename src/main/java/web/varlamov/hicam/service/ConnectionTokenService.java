package web.varlamov.hicam.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import web.varlamov.hicam.entity.UserDetailsImpl;

@Service
public class ConnectionTokenService {
  public String getConnectionTokenAsLinkFor(UserDetailsImpl userDetails, HttpServletRequest request) {
    String token = userDetails.getUsername();
    return "http://localhost:8080/connect/" + token;
  }
}

//    String protocol = request.isSecure() ? "https://": "http://";
//    String host = request.getServerName();
//    int port = request.getServerPort();
//
//    return protocol + host;
