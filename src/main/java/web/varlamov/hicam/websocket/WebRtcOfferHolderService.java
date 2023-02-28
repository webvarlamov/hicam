package web.varlamov.hicam.websocket;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web.varlamov.hicam.entity.DeviceConnectionType;
import web.varlamov.hicam.websocket.callback.WebRtcHolderCallback;

@Service
public class WebRtcOfferHolderService {
  public ConcurrentHashMap<String, WebRtcOfferWrapper> deviceWebRtcOfferMap = new ConcurrentHashMap<>();
  @Autowired
  public List<WebRtcHolderCallback> webRtcHolderCallbackList;

  public void addWebRtcOffer(String offer, String deviceConnectionId, String userId, DeviceConnectionType deviceConnectionType) {
    WebRtcOfferWrapper webRtcOfferWrapper = new WebRtcOfferWrapper(offer, deviceConnectionId, deviceConnectionType);
    String key = userId + ":" + deviceConnectionId;
    deviceWebRtcOfferMap.put(key, webRtcOfferWrapper);

    webRtcHolderCallbackList.forEach(WebRtcHolderCallback::invoke);
  }

  public WebRtcOfferWrapper getWebRtcOfferWrapper(String userId, String deviceConnectionId) {
    String key = userId + ":" + deviceConnectionId;
    return deviceWebRtcOfferMap.get(key);
  }
}


