package web.varlamov.hicam.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;

public class DeviceConnectionHandleInterceptor implements HandlerInterceptor {
  Logger logger = LoggerFactory.getLogger(DeviceConnectionHandleInterceptor.class);

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//    String deviceConnectionId = HttpUtils.getDeviceConnectionId(request);
//
//    if (deviceConnectionId == null) {
//      deviceConnectionId = UUID.randomUUID().toString();
//      logger.info("Generate new deviceConnectionId: " + deviceConnectionId);
//      response.addCookie(new Cookie(DEVICE_CONNECTION_ID, deviceConnectionId));
//    } else {
//      logger.info("Cookie deviceConnectionId is : " + deviceConnectionId);
//    }

    return true;
  }
}
