package web.varlamov.hicam.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.varlamov.hicam.dto.UserMineDto;
import web.varlamov.hicam.entity.UserDetailsImpl;
import web.varlamov.hicam.repository.UserDetailsRepository;
import web.varlamov.hicam.websocket.WebSocketSessionHolderService;

@RestController
@RequestMapping("/user_api")
public class UserRestController {
  @Autowired
  UserDetailsRepository userDetailsRepository;
  @Autowired
  WebSocketSessionHolderService webSocketSessionHolderService;

  @RequestMapping("/mine")
  public UserMineDto status(Authentication authentication) {
    String name = authentication.getName();
    UserDetailsImpl userDetails  = userDetailsRepository.findByUsername(name);

    UserMineDto userMineDto = new UserMineDto();
    userMineDto.setUsername(userDetails.getUsername());
    userMineDto.setDeviceSessionsCount(
        webSocketSessionHolderService.getDeviceWebSocketSessionWrappers(userDetails.getId()).size()
    );

    return userMineDto;
  }
}
