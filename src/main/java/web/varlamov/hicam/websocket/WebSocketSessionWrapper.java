package web.varlamov.hicam.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.socket.WebSocketSession;
import web.varlamov.hicam.entity.DeviceType;

@Data
@AllArgsConstructor
public class WebSocketSessionWrapper {
  private String deviceId;
  private String deviceSessionId;
  private DeviceType deviceType;
  private WebSocketSession webSocketSession;
}
