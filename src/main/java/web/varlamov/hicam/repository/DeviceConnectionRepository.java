package web.varlamov.hicam.repository;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import web.varlamov.hicam.entity.DeviceConnection;
import web.varlamov.hicam.entity.UserDetailsImpl;

@Repository
public interface DeviceConnectionRepository extends CrudRepository<DeviceConnection, String> {
  List<DeviceConnection> getDeviceConnectionByUserDetails(UserDetailsImpl userDetails);
  void removeDeviceConnectionById(UserDetailsImpl userDetails);
}
