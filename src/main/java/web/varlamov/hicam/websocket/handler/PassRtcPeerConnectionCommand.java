package web.varlamov.hicam.websocket.handler;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
  Logger logger = LoggerFactory.getLogger(PassRtcPeerConnectionCommand.class);

  @Autowired
  WebSocketSessionHolderService webSocketSessionHolderService;
  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Override
  public synchronized void handleTextMessage(String rawMessage, CommandSocketTextMessage parsedMessage, WebSocketSession session) {
    logger.info("Handle new message: ");
    logger.info("   Direction: " + parsedMessage.getFrom() + " => " + parsedMessage.getTo());
    logger.info("   Mission: " + parsedMessage.getMission());
    logger.info("   Purpose: " + parsedMessage.getPurpose());
    logger.info("   Data: " + parsedMessage.getData());

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


