package web.varlamov.hicam.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/device")
public class DevicePageController {
  @GetMapping
  @RequestMapping("/{device_connection_id}")
  public String get(@PathVariable String device_connection_id) {
    return "device";
  }
}
