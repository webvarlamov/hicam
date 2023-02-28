package web.varlamov.hicam.rest;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.varlamov.hicam.interceptor.DeviceConnectionHandleInterceptor;
import web.varlamov.hicam.utils.HttpUtils;
import static web.varlamov.hicam.utils.HttpUtils.DEVICE_CONNECTION_ID;

@RestController()
@RequestMapping("/handshake_api")
public class HandshakeRestController {
  Logger logger = LoggerFactory.getLogger(DeviceConnectionHandleInterceptor.class);

  @RequestMapping("/get_device_id")
  public String getDeviceId(HttpServletRequest request, HttpServletResponse response) {
    String deviceConnectionId = HttpUtils.getDeviceConnectionId(request);

    if (deviceConnectionId == null) {
      deviceConnectionId = UUID.randomUUID().toString();
      logger.info("Generate new deviceConnectionId: " + deviceConnectionId);
      response.addCookie(new Cookie(DEVICE_CONNECTION_ID, deviceConnectionId));
    } else {
      logger.info("Cookie deviceConnectionId is : " + deviceConnectionId);
    }

    return deviceConnectionId;
  }
}
