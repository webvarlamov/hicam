package web.varlamov.hicam.security;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
  @Bean
  public UserDetailsService userDetailsServiceBean() {
    return new UserDetailsServiceImpl();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new PasswordEncoder() {
      @Override
      public String encode(CharSequence rawPassword) {
        return rawPassword.toString();
      }

      @Override
      public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return true;
      }
    };
  }

  @Bean
  public TokenAuthenticationManager tokenAuthenticationManagerBean() {
    return new TokenAuthenticationManager();
  }

  public TokenAuthenticationFilter getTokenAuthenticationFilterBean() {
    TokenAuthenticationFilter tokenAuthenticationFilter = new TokenAuthenticationFilter();
    tokenAuthenticationFilter.setAuthenticationManager(tokenAuthenticationManagerBean());
    tokenAuthenticationFilter.setRequiresAuthenticationRequestMatcher(new AntPathRequestMatcher("/connect/*"));
    return tokenAuthenticationFilter;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
    httpSecurity.csrf().disable();

    httpSecurity.authorizeHttpRequests(auth -> {
      auth.requestMatchers("/public/**").permitAll();
      auth.requestMatchers("/signin/**", "/signin_api/**").permitAll();
      auth.requestMatchers("/").permitAll();

      auth.requestMatchers("/private/**", "/private/**").authenticated();

      auth.requestMatchers("/connect/**").authenticated();
      auth.requestMatchers("/user_api/**").authenticated();
      auth.requestMatchers("/admin","/admin_api/**", "connection_token").authenticated();
      auth.requestMatchers("/device","/device/**","/device_api/**").authenticated();
      auth.requestMatchers("/handshake_api/**").authenticated();
      auth.requestMatchers("/command-socket").authenticated();
    });

    httpSecurity
        .httpBasic();

    httpSecurity.formLogin();

    httpSecurity.logout()
        .logoutUrl("/logout")
        .logoutSuccessUrl("/")
        .clearAuthentication(true)
        .invalidateHttpSession(true)
        .deleteCookies("JSESSIONID");

    httpSecurity.addFilterBefore(getTokenAuthenticationFilterBean(), BasicAuthenticationFilter.class);

    return httpSecurity.build();
  }

  @Bean
  public DaoAuthenticationProvider daoAuthenticationProviderBean() {
    DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
    authenticationProvider.setPasswordEncoder(passwordEncoder());
    authenticationProvider.setUserDetailsService(userDetailsServiceBean());
    return authenticationProvider;
  }
}
