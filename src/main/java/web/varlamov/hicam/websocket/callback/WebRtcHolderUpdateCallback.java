package web.varlamov.hicam.websocket.callback;

import org.springframework.stereotype.Component;

@Component
public class WebRtcHolderUpdateCallback implements WebRtcHolderCallback {
  @Override
  public void invoke() {
    System.out.println(1111);
  }
}
