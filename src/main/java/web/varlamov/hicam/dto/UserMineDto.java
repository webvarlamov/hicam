package web.varlamov.hicam.dto;

import lombok.Data;

@Data
public class UserMineDto {
  String username;
  int deviceSessionsCount;
}
