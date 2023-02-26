package web.varlamov.hicam.security;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;

public class TokenAuthenticationFilter extends AbstractPreAuthenticatedProcessingFilter {
  public static final GrantedAuthority TOKEN_AUTHORITY = () -> "TOKEN_AUTHORITY";

  @Override
  protected Object getPreAuthenticatedPrincipal(HttpServletRequest request) {
    return Arrays.stream(request.getRequestURI().split("/"))
        .reduce((a, b) -> b)
        .orElse(null);
  }

  @Override
  protected Object getPreAuthenticatedCredentials(HttpServletRequest request) {
    return List.of(TOKEN_AUTHORITY);
  }



}
