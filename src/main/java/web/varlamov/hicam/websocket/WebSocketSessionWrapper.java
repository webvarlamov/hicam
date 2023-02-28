package web.varlamov.hicam.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.socket.WebSocketSession;
import web.varlamov.hicam.entity.DeviceConnectionType;

@Data
@AllArgsConstructor
public class WebSocketSessionWrapper {
  private String deviceConnectionId;
  private DeviceConnectionType deviceConnectionType;
  private WebSocketSession webSocketSession;
}
