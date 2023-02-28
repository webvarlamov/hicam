package web.varlamov.hicam.websocket.handler;

import org.springframework.web.socket.WebSocketSession;
import web.varlamov.hicam.websocket.CommandSocketTextMessage;

public interface CommandSocketTextMessageHandler {
  void handleTextMessage(String rawMessage, CommandSocketTextMessage commandSocketTextMessage, WebSocketSession session);
}
