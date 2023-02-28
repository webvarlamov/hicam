package web.varlamov.hicam.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommandSocketTextMessage {
  CommandSocketMessageType type;
  String data;
}
