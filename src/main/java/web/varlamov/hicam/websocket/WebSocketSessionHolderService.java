package web.varlamov.hicam.websocket;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;
import web.varlamov.hicam.entity.DeviceType;

@Service
public class WebSocketSessionHolderService {
  public ConcurrentHashMap<String, List<WebSocketSessionWrapper>> commandSocketSessionMap = new ConcurrentHashMap<>();
  public Logger logger = LoggerFactory.getLogger(WebSocketSessionHolderService.class);

  public WebSocketSession getWebSocketSessionByDeviceSessionId(String userId, String deviceSessionId) {
    return Optional.ofNullable(commandSocketSessionMap.get(userId))
        .flatMap(webSocketSessionWrappers -> webSocketSessionWrappers.stream()
        .filter(webSocketSessionWrapper -> webSocketSessionWrapper.getDeviceSessionId().equals(deviceSessionId))
        .findFirst()
        .map(WebSocketSessionWrapper::getWebSocketSession))
        .orElse(null);
  }

  public List<WebSocketSessionWrapper> getDeviceWebSocketSessionWrappers(String userId) {
    return Optional.ofNullable(commandSocketSessionMap.get(userId))
        .map(webSocketSessionWrappers ->
            webSocketSessionWrappers.stream()
                .filter(webSocketSessionWrapper -> webSocketSessionWrapper.getDeviceType().equals(DeviceType.REMOTE))
                .toList()
        ).orElse(new ArrayList<>());
  }

  public List<WebSocketSessionWrapper> getAdminWebSocketSessionWrappers(String userId) {
    return Optional.ofNullable(commandSocketSessionMap.get(userId))
        .map(webSocketSessionWrappers ->
            webSocketSessionWrappers.stream()
                .filter(webSocketSessionWrapper -> webSocketSessionWrapper.getDeviceType().equals(DeviceType.ADMIN))
                .toList()
        ).orElse(new ArrayList<>());
  }

  public void add(WebSocketSessionWrapper webSocketSessionWrapper, String userId) {
    List<WebSocketSessionWrapper> webSocketSessions = commandSocketSessionMap.get(userId);

    if (webSocketSessions == null) {
      webSocketSessions = new CopyOnWriteArrayList<>();
      webSocketSessions.add(webSocketSessionWrapper);
      commandSocketSessionMap.put(userId, webSocketSessions);
    } else {
      webSocketSessions.add(0, webSocketSessionWrapper);
    }

    logger.info("User with id="+ userId +" has created a new connection");
    commandSocketSessionMap.get(userId).forEach(exitWrapper -> {
      logger.info(
            "   deviceId: " + exitWrapper.getDeviceId()
          + "; deviceType: " + exitWrapper.getDeviceType()
          + "; deviceSessionId: " +exitWrapper.getDeviceSessionId()
          + ";"
      );
    });
  }

  public void remove(WebSocketSession webSocketSessionWrapper, String userId) {
    List<WebSocketSessionWrapper> webSocketSessions = commandSocketSessionMap.get(userId);
    webSocketSessions.removeIf(wrapper -> wrapper.getWebSocketSession().equals(webSocketSessionWrapper));

    logger.info("User with id="+ userId +" has removed connection");
    commandSocketSessionMap.get(userId).forEach(exitWrapper -> {
      logger.info(
          "   deviceId: " + exitWrapper.getDeviceId()
              + "; deviceType: " + exitWrapper.getDeviceType()
              + "; deviceSessionId: " +exitWrapper.getDeviceSessionId()
              + ";"
      );
    });
  }
}


