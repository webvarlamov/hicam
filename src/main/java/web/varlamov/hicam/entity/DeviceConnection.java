package web.varlamov.hicam.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DeviceConnection {
  private String deviceConnectionId;
  private DeviceConnectionType deviceConnectionType;
  private String offer;
}
