package web.varlamov.hicam.rest;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user_api")
public class UserRestController {
  @RequestMapping("/mine")
  public String status(Authentication authentication) {
    return "ok";
  }
}
