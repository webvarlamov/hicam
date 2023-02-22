package web.varlamov.hicam.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetailsService;
import web.varlamov.hicam.repository.UserDetailsRepository;

public class UserDetailsServiceImpl implements UserDetailsService {
  @Autowired
  UserDetailsRepository userDetailsRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return userDetailsRepository.findByUsername(username);
  }
}
