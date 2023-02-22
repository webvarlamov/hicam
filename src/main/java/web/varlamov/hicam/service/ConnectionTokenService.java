package web.varlamov.hicam.service;

import org.springframework.stereotype.Service;
import web.varlamov.hicam.entity.UserDetailsImpl;

@Service
public class ConnectionTokenService {
  public String getConnectionTokenAsLinkFor(UserDetailsImpl userDetails) {
    return "http://localhost:8080/connect/" + userDetails.getUsername();
  }
}
