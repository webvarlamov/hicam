package web.varlamov.hicam.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import web.varlamov.hicam.entity.DeviceConnectionType;

@Data
@AllArgsConstructor
public class WebRtcOfferWrapper {
  private String webRtcOffer;
  private String deviceConnectionId;
  private DeviceConnectionType deviceConnectionType;
}
