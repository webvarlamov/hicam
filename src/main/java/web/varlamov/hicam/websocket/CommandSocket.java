package web.varlamov.hicam.websocket;

import com.google.gson.Gson;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import web.varlamov.hicam.entity.DeviceType;
import web.varlamov.hicam.entity.UserDetailsImpl;
import web.varlamov.hicam.interceptor.DeviceConnectionHandleInterceptor;
import web.varlamov.hicam.repository.UserDetailsRepository;
import web.varlamov.hicam.utils.HttpUtils;
import web.varlamov.hicam.websocket.handler.PassRtcPeerConnectionCommand;

@Component
public class CommandSocket extends TextWebSocketHandler {
  Logger logger = LoggerFactory.getLogger(DeviceConnectionHandleInterceptor.class);
  Gson gson = new Gson();

  @Autowired
  WebSocketSessionHolderService webSocketSessionHolderService;
  @Autowired
  UserDetailsRepository userDetailsRepository;
  @Autowired
  PassRtcPeerConnectionCommand passRtcPeerConnectionCommand;

  @Override
  public void handleTextMessage(WebSocketSession session, TextMessage message) {
    String rawMessage = message.getPayload();
    CommandSocketTextMessage parsedMessage = gson.fromJson(rawMessage, CommandSocketTextMessage.class);

    switch (parsedMessage.getMission()) {
      case PASS_RTC_PEER_CONNECTION_COMMAND -> passRtcPeerConnectionCommand.handleTextMessage(rawMessage, parsedMessage, session);
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

    String deviceType = HttpUtils.getDeviceType(session.getUri());
    String deviceId = HttpUtils.getDeviceId(session.getUri());
    String deviceSessionId = HttpUtils.getDeviceSessionId(session.getUri());

    WebSocketSessionWrapper webSocketSessionWrapper = new WebSocketSessionWrapper(deviceId, deviceSessionId, DeviceType.valueOf(deviceType), session);

    this.webSocketSessionHolderService.add(webSocketSessionWrapper, userDetails.getId());
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
