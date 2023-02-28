package web.varlamov.hicam.websocket;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;
import web.varlamov.hicam.entity.DeviceConnectionType;
import web.varlamov.hicam.websocket.callback.WebSocketSessionHolderCallback;

@Service
public class WebSocketSessionHolderService {
  public ConcurrentHashMap<String, List<WebSocketSessionWrapper>> commandSocketSessionMap = new ConcurrentHashMap<>();

  @Autowired
  List<WebSocketSessionHolderCallback> webSocketSessionHolderCallbackList;

  public List<WebSocketSession> getAdminWebSocketSessions(String userId) {
    return commandSocketSessionMap.get(userId).stream()
        .filter(webSocketSessionWrapper -> webSocketSessionWrapper.getDeviceConnectionType().equals(DeviceConnectionType.ADMIN))
        .map(WebSocketSessionWrapper::getWebSocketSession)
        .toList();
  }

  public List<WebSocketSession> getDeviceWebSocketSessions(String userId) {
    return commandSocketSessionMap.get(userId).stream()
        .filter(webSocketSessionWrapper -> webSocketSessionWrapper.getDeviceConnectionType().equals(DeviceConnectionType.REMOTE))
        .map(WebSocketSessionWrapper::getWebSocketSession)
        .toList();
  }

  public List<WebSocketSessionWrapper> getDeviceWebSocketSessionWrappers(String userId) {
    // NPE
    return commandSocketSessionMap.get(userId).stream()
        .filter(webSocketSessionWrapper -> webSocketSessionWrapper.getDeviceConnectionType().equals(DeviceConnectionType.REMOTE))
        .toList();
  }
}


