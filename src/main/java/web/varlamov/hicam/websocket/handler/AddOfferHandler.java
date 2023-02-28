package web.varlamov.hicam.websocket.handler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import web.varlamov.hicam.entity.DeviceConnectionType;
import web.varlamov.hicam.entity.UserDetailsImpl;
import web.varlamov.hicam.repository.UserDetailsRepository;
import web.varlamov.hicam.utils.HttpUtils;
import web.varlamov.hicam.websocket.CommandSocketTextMessage;
import web.varlamov.hicam.websocket.WebRtcOfferHolderService;
import web.varlamov.hicam.websocket.WebSocketSessionHolderService;

@Component
public class AddOfferHandler implements CommandSocketTextMessageHandler {
  @Autowired
  WebSocketSessionHolderService webSocketSessionHolderService;
  @Autowired
  WebRtcOfferHolderService webRtcOfferHolderService;
  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Override
  public void handleTextMessage(String rawMessage, CommandSocketTextMessage commandSocketTextMessage, WebSocketSession session) {
    AbstractAuthenticationToken principal = (AbstractAuthenticationToken) session.getPrincipal();

    assert principal != null;
    String username = principal.getName();
    UserDetailsImpl userDetails = userDetailsRepository.findByUsername(username);
    String offer = commandSocketTextMessage.getData();

    String deviceConnectionType = HttpUtils.getDeviceConnectionType(session.getUri());
    String deviceConnectionId = HttpUtils.getDeviceConnectionId(session.getUri());

    webRtcOfferHolderService.addWebRtcOffer(offer, deviceConnectionId, userDetails.getId(), DeviceConnectionType.valueOf(deviceConnectionType));
  }
}


