package web.varlamov.hicam.websocket;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import web.varlamov.hicam.entity.UserDetailsImpl;
import web.varlamov.hicam.interceptor.DeviceConnectionHandleInterceptor;
import web.varlamov.hicam.repository.UserDetailsRepository;

@Component
public class CommandSocket extends TextWebSocketHandler {
  Logger logger = LoggerFactory.getLogger(DeviceConnectionHandleInterceptor.class);

  @Autowired
  WebSocketSessionHolderService webSocketSessionHolderService;
  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Override
  public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
    logger.info("Handle new message: " + message);
  }

  @Override
  public void afterConnectionEstablished(WebSocketSession session) {
    AbstractAuthenticationToken principal = (AbstractAuthenticationToken) session.getPrincipal();
    assert principal != null;

    String username = principal.getName();
    UserDetailsImpl userDetails = userDetailsRepository.findByUsername(username);

    List<WebSocketSession> webSocketSessions = webSocketSessionHolderService.adminCommandSocketSessionMap.get(userDetails.getId());

    if (webSocketSessions == null) {
      webSocketSessions = new CopyOnWriteArrayList();
      webSocketSessionHolderService.adminCommandSocketSessionMap.put(userDetails.getId(), webSocketSessions);
    } else {
      webSocketSessions.add(0, session);
    }

    logger.info("User with id: " + userDetails.getId() + " has sessions: ");
    for (WebSocketSession webSocketSession : webSocketSessions) {
      logger.info("   WebSocketSession id: " + webSocketSession.getId());
    }
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    AbstractAuthenticationToken principal = (AbstractAuthenticationToken) session.getPrincipal();
    assert principal != null;

    String username = principal.getName();
    UserDetailsImpl userDetails = userDetailsRepository.findByUsername(username);
    List<WebSocketSession> webSocketSessions = webSocketSessionHolderService.adminCommandSocketSessionMap.get(userDetails.getId());
    webSocketSessions.remove(session);
  }
}
