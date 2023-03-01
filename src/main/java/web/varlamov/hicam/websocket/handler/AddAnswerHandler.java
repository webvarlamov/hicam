package web.varlamov.hicam.websocket.handler;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import web.varlamov.hicam.entity.UserDetailsImpl;
import web.varlamov.hicam.repository.UserDetailsRepository;
import web.varlamov.hicam.websocket.CommandSocketTextMessage;
import web.varlamov.hicam.websocket.WebRtcOfferHolderService;
import web.varlamov.hicam.websocket.WebSocketSessionHolderService;
import web.varlamov.hicam.websocket.WebSocketSessionWrapper;

@Component
public class AddAnswerHandler implements CommandSocketTextMessageHandler {
  @Autowired
  WebSocketSessionHolderService webSocketSessionHolderService;
  @Autowired
  WebRtcOfferHolderService webRtcOfferHolderService;
  @Autowired
  UserDetailsRepository userDetailsRepository;
  Gson gson = new Gson();

  @Override
  public void handleTextMessage(String rawMessage, CommandSocketTextMessage commandSocketTextMessage, WebSocketSession session) {
    AbstractAuthenticationToken principal = (AbstractAuthenticationToken) session.getPrincipal();

    assert principal != null;
    String username = principal.getName();
    UserDetailsImpl userDetails = userDetailsRepository.findByUsername(username);

    AddAnswerMessagePayload payload = gson.fromJson(commandSocketTextMessage.getData(), AddAnswerMessagePayload.class);
    List<WebSocketSessionWrapper> deviceWebSocketSessionWrappers = webSocketSessionHolderService.getDeviceWebSocketSessionWrappers(userDetails.getId());

    Optional<WebSocketSessionWrapper> destinationDevice = deviceWebSocketSessionWrappers.stream()
        .filter(webSocketSessionWrapper -> payload.getDestinationDeviceConnectionId()
            .equals(webSocketSessionWrapper.getDeviceId()))
        .findFirst();

    if (destinationDevice.isPresent()) {
      WebSocketSession webSocketSession = destinationDevice.get().getWebSocketSession();
      try {
        webSocketSession.sendMessage(new TextMessage(rawMessage));
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  @Data
  public static class AddAnswerMessagePayload {
    String destinationDeviceConnectionId;
    String answer;
  }
}


