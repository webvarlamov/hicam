package web.varlamov.hicam.rest;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/connect")
public class ConnectionController {

  @GetMapping("/{token}")
  public void connect(@PathVariable String token, HttpServletResponse httpServletResponse) {
    httpServletResponse.setHeader("Location", "/device");
    httpServletResponse.setStatus(302);
  }
}
