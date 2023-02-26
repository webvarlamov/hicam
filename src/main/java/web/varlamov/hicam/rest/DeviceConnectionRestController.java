package web.varlamov.hicam.rest;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import web.varlamov.hicam.entity.UserDetailsImpl;
import web.varlamov.hicam.interceptor.DeviceConnectionHandleInterceptor;
import web.varlamov.hicam.repository.UserDetailsRepository;
import web.varlamov.hicam.websocket.WebSocketSessionHolderService;

@RestController
@RequestMapping("/device_api")
public class DeviceConnectionRestController {
  Logger logger = LoggerFactory.getLogger(DeviceConnectionHandleInterceptor.class);

  @Autowired
  WebSocketSessionHolderService webSocketSessionHolderService;
  @Autowired
  UserDetailsRepository userDetailsRepository;

  @PostMapping("/transfer_offer/{device_connection_id}")
  public void transferOffer(@RequestBody String offer, @PathVariable(name = "device_connection_id") String deviceConnectionId, Principal principal) {
    UserDetailsImpl userDetails = userDetailsRepository.findByUsername(principal.getName());
    List<WebSocketSession> webSocketSessions = webSocketSessionHolderService.getAdminWebSocketSessions(userDetails.getId());

    if (webSocketSessions != null) {
      webSocketSessions.forEach(session -> {
        try {
          session.sendMessage(new TextMessage(offer));
        } catch (IOException e) {
          e.printStackTrace();
        }
      });
    }

    logger.info("Transfer RTCConnectionOffer for user: " + userDetails.getUsername());
  }
}
