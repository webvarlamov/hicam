package web.varlamov.hicam.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Optional;
import org.springframework.web.socket.WebSocketSession;

public class HttpUtils {
  public final static String DEVICE_CONNECTION_ID = "device_connection_id";

  public static String getDeviceConnectionId(HttpServletRequest request) {
    return Arrays.stream(
            Optional.ofNullable(request.getCookies()).orElse(new Cookie[0])
        ).filter(cookie -> DEVICE_CONNECTION_ID.equals(cookie.getName()))
        .findFirst()
        .map(Cookie::getValue)
        .orElse(null);
  }

  public static String getDeviceConnectionId(WebSocketSession session) {
    return Optional.ofNullable(session.getHandshakeHeaders().get("cookie"))
        .map(headerValues -> headerValues.size() > 0 ? headerValues.get(0) : null)
        .flatMap(value -> Arrays
            .stream(value.split("; "))
            .map(pairString -> {
              String[] split = pairString.split("=");
              return new Cookie(split[0], split[1]);
            }).filter(cookie -> HttpUtils.DEVICE_CONNECTION_ID.equals(cookie.getName()))
            .findFirst()
        ).map(Cookie::getValue)
        .orElse(null);
  }
}
