package web.varlamov.hicam.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/device")
public class DevicePageController {
  @GetMapping
  public String get() {
    return "device";
  }
}
