package web.varlamov.hicam.websocket;

import com.google.gson.Gson;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import web.varlamov.hicam.entity.DeviceConnectionType;
import web.varlamov.hicam.entity.UserDetailsImpl;
import web.varlamov.hicam.interceptor.DeviceConnectionHandleInterceptor;
import web.varlamov.hicam.repository.UserDetailsRepository;
import web.varlamov.hicam.utils.HttpUtils;
import web.varlamov.hicam.websocket.handler.AddAnswerHandler;
import web.varlamov.hicam.websocket.handler.AddOfferHandler;

@Component
public class CommandSocket extends TextWebSocketHandler {
  Logger logger = LoggerFactory.getLogger(DeviceConnectionHandleInterceptor.class);
  Gson gson = new Gson();

  @Autowired
  WebSocketSessionHolderService webSocketSessionHolderService;
  @Autowired
  UserDetailsRepository userDetailsRepository;
  @Autowired
  AddOfferHandler addOfferHandler;
  @Autowired
  AddAnswerHandler addAnswerHandler;

  @Override
  public void handleTextMessage(WebSocketSession session, TextMessage message) {
    String rawMessage = message.getPayload();
    CommandSocketTextMessage parsedMessage = gson.fromJson(rawMessage, CommandSocketTextMessage.class);

    switch (parsedMessage.type) {
      case ADD_OFFER -> addOfferHandler.handleTextMessage(rawMessage, parsedMessage, session);
      case ADD_ANSWER -> addAnswerHandler.handleTextMessage(rawMessage, parsedMessage, session);
    }

    logger.info("Handle new message: " + message);
  }

  @Override
  public void afterConnectionEstablished(WebSocketSession session) {
    AbstractAuthenticationToken principal = (AbstractAuthenticationToken) session.getPrincipal();

    assert principal != null;
    String username = principal.getName();
    UserDetailsImpl userDetails = userDetailsRepository.findByUsername(username);

    assert session.getUri() != null;
    List<NameValuePair> parse = URLEncodedUtils.parse(session.getUri(), StandardCharsets.UTF_8);

    String deviceConnectionType = HttpUtils.getDeviceConnectionType(session.getUri());
    String deviceConnectionId = HttpUtils.getDeviceConnectionId(session.getUri());

    WebSocketSessionWrapper webSocketSessionWrapper = new WebSocketSessionWrapper(deviceConnectionId, DeviceConnectionType.valueOf(deviceConnectionType), session);

    List<WebSocketSessionWrapper> webSocketSessions = webSocketSessionHolderService
        .commandSocketSessionMap.get(userDetails.getId());

    if (webSocketSessions == null) {
      webSocketSessions = new CopyOnWriteArrayList<>();
      webSocketSessions.add(webSocketSessionWrapper);
      webSocketSessionHolderService.commandSocketSessionMap.put(userDetails.getId(), webSocketSessions);
    } else {
      webSocketSessions.add(0, webSocketSessionWrapper);
    }

    logger.info("   User with id: " + userDetails.getId() + " has sessions connect WebSocket ");
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    AbstractAuthenticationToken principal = (AbstractAuthenticationToken) session.getPrincipal();
    assert principal != null;

    String username = principal.getName();
    UserDetailsImpl userDetails = userDetailsRepository.findByUsername(username);
    List<WebSocketSessionWrapper> webSocketSessions = webSocketSessionHolderService.commandSocketSessionMap.get(userDetails.getId());
    webSocketSessions.removeIf(wrapper -> wrapper.getWebSocketSession().equals(session));
  }
}
