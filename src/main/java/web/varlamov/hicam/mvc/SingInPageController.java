package web.varlamov.hicam.mvc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import web.varlamov.hicam.repository.UserDetailsRepository;

@Controller
@RequestMapping("/signin")
public class SingInPageController {
  @Autowired
  UserDetailsRepository userDetailsRepository;

  @GetMapping
  public String index() {
    return "signin";
  }
}
