package web.varlamov.hicam.rest;

import java.io.Serializable;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.varlamov.hicam.entity.UserDetailsImpl;
import web.varlamov.hicam.repository.UserDetailsRepository;

@RestController
@RequestMapping("/signin_api")
public class SingInRestController {
  @Autowired
  UserDetailsRepository userDetailsRepository;

  @PostMapping
  public String post(SigninForm signinForm) {
    if (signinForm.getPassword() == null)
      return SigninStatus.PASSWORD_IS_NULL.name();
    if (signinForm.getUsername() == null)
      return SigninStatus.USERNAME_IS_NULL.name();

    UserDetailsImpl userExist = userDetailsRepository.findByUsername(signinForm.getUsername());

    if (userExist == null) {
      UserDetailsImpl userDetails = new UserDetailsImpl(
          null,
          signinForm.getUsername(),
          signinForm.getPassword(),
          true,
          true,
          true,
          true
      );
      userDetailsRepository.save(userDetails);
      return SigninStatus.OK.name();
    } else {
      return SigninStatus.USER_EXIST.name();
    }
  }

  @Data
  public static class SigninForm implements Serializable {
    public String username;
    public String password;
  }

  public static enum SigninStatus {
    OK,
    USER_EXIST,
    USERNAME_IS_NULL,
    PASSWORD_IS_NULL
  }
}
