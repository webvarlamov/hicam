package web.varlamov.hicam.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;
import web.varlamov.hicam.entity.UserDetailsImpl;

@Repository
public interface UserDetailsRepository extends CrudRepository<UserDetailsImpl, String> {
  UserDetails findByUsername(String username);
}
