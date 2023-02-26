package web.varlamov.hicam.websocket;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;
import web.varlamov.hicam.entity.UserDetailsImpl;

@Service
public class WebSocketSessionHolderService {
  public ConcurrentHashMap<String, List<WebSocketSession>> adminCommandSocketSessionMap = new ConcurrentHashMap<>();
  public ConcurrentHashMap<String, WebSocketSession> deviceCommandSocketSessionMap = new ConcurrentHashMap<>();

  public List<WebSocketSession> getAdminWebSocketSessions(String userId) {
    return adminCommandSocketSessionMap.get(userId);
  }
}


