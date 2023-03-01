package web.varlamov.hicam.websocket.handler;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import web.varlamov.hicam.entity.UserDetailsImpl;
import web.varlamov.hicam.repository.UserDetailsRepository;
import web.varlamov.hicam.websocket.CommandSocketTextMessage;
import web.varlamov.hicam.websocket.WebSocketSessionHolderService;

@Component
public class PassRtcPeerConnectionCommand implements CommandSocketTextMessageHandler {
  @Autowired
  WebSocketSessionHolderService webSocketSessionHolderService;
  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Override
  public void handleTextMessage(String rawMessage, CommandSocketTextMessage parsedMessage, WebSocketSession session) {
    AbstractAuthenticationToken principal = (AbstractAuthenticationToken) session.getPrincipal();

    assert principal != null;
    String username = principal.getName();
    UserDetailsImpl userDetails = userDetailsRepository.findByUsername(username);

    String destinationDeviceSessionId = parsedMessage.getTo();

    WebSocketSession webSocketSession = webSocketSessionHolderService.getWebSocketSessionByDeviceSessionId(userDetails.getId(), destinationDeviceSessionId);

    if (webSocketSession != null) {
      try {
        webSocketSession.sendMessage(new TextMessage(rawMessage));
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }
}


