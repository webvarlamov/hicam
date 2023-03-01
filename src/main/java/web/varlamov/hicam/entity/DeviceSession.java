package web.varlamov.hicam.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DeviceSession {
  private String deviceId;
  private String deviceSessionId;
  private DeviceType deviceType;
}
