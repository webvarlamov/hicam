package web.varlamov.hicam.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public class TokenAuthenticationManager implements AuthenticationManager {
  @Autowired
  UserDetailsService userDetailsService;

  @Override
  public Authentication authenticate(Authentication authentication) throws AuthenticationException {
    String username = (String) authentication.getPrincipal();
    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
    if (userDetails != null) {
      authentication.setAuthenticated(true);
    }

    return authentication;
  }
}
