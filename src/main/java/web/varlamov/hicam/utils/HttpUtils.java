package web.varlamov.hicam.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.springframework.web.socket.WebSocketSession;

public class HttpUtils {
  public final static String DEVICE_ID = "device_id";
  public final static String DEVICE_SESSION_ID = "device_session_id";

  public static String getDeviceId(HttpServletRequest request) {
    return Arrays.stream(
            Optional.ofNullable(request.getCookies()).orElse(new Cookie[0])
        ).filter(cookie -> DEVICE_ID.equals(cookie.getName()))
        .findFirst()
        .map(Cookie::getValue)
        .orElse(null);
  }

  public static String getDeviceId(WebSocketSession session) {
    return Optional.ofNullable(session.getHandshakeHeaders().get("cookie"))
        .map(headerValues -> headerValues.size() > 0 ? headerValues.get(0) : null)
        .flatMap(value -> Arrays
            .stream(value.split("; "))
            .map(pairString -> {
              String[] split = pairString.split("=");
              return new Cookie(split[0], split[1]);
            }).filter(cookie -> HttpUtils.DEVICE_ID.equals(cookie.getName()))
            .findFirst()
        ).map(Cookie::getValue)
        .orElse(null);
  }

  public static String getDeviceType(URI uri) {
    List<NameValuePair> parse = URLEncodedUtils.parse(uri, StandardCharsets.UTF_8);
    String deviceType = parse.stream()
        .filter(pair -> "deviceType".equals(pair.getName()))
        .findFirst()
        .map(NameValuePair::getValue)
        .orElse(null);
    return deviceType;
  }

  public static String getDeviceId(URI uri) {
    List<NameValuePair> parse = URLEncodedUtils.parse(uri, StandardCharsets.UTF_8);
    String deviceId = parse.stream()
        .filter(pair -> "deviceId".equals(pair.getName()))
        .findFirst()
        .map(NameValuePair::getValue)
        .orElse(null);
    return deviceId;
  }

  public static String getDeviceSessionId(URI uri) {
    List<NameValuePair> parse = URLEncodedUtils.parse(uri, StandardCharsets.UTF_8);
    String deviceSessionId = parse.stream()
        .filter(pair -> "deviceSessionId".equals(pair.getName()))
        .findFirst()
        .map(NameValuePair::getValue)
        .orElse(null);
    return deviceSessionId;
  }
}
