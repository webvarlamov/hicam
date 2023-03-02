package web.varlamov.hicam.rest;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.varlamov.hicam.entity.DeviceType;
import web.varlamov.hicam.utils.HttpUtils;
import static web.varlamov.hicam.utils.HttpUtils.DEVICE_ID;
import static web.varlamov.hicam.utils.HttpUtils.DEVICE_SESSION_ID;

@RestController()
@RequestMapping("/handshake_api")
public class HandshakeRestController {
  Logger logger = LoggerFactory.getLogger(HandshakeRestController.class);

  @RequestMapping("/get_device_id")
  public String getDeviceId(HttpServletRequest request, HttpServletResponse response, @Param("deviceType") DeviceType deviceType) {
    String deviceId = HttpUtils.getDeviceId(request);

    if (deviceId == null) {
      deviceId = deviceType + "_" +UUID.randomUUID();
      logger.info("Generate new deviceConnectionId: " + deviceId);
      response.addCookie(new Cookie(DEVICE_ID, deviceId));
    } else {
      logger.info("Cookie deviceConnectionId is : " + deviceId);
    }

    return deviceId;
  }

  @RequestMapping("/get_device_session_id")
  public String getDeviceSessionId(HttpServletRequest request, HttpServletResponse response, @Param("deviceType") DeviceType deviceType) {
    String deviceSessionId = deviceType + "_" +UUID.randomUUID();
    response.addCookie(new Cookie(DEVICE_SESSION_ID, deviceSessionId));
    return deviceSessionId;
  }
}
