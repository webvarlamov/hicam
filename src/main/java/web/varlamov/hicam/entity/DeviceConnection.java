package web.varlamov.hicam.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import org.hibernate.annotations.GenericGenerator;

@Entity
public class DeviceConnection {
  @Id
  @GeneratedValue(generator="system-uuid")
  @GenericGenerator(name="system-uuid", strategy = "uuid")
  private String id;
  private LocalDateTime connectionTime;
  @ManyToOne
  private UserDetailsImpl userDetails;

  public DeviceConnection() {
  }

  public DeviceConnection(String id, LocalDateTime connectionTime, UserDetailsImpl userDetails) {
    this.id = id;
    this.connectionTime = connectionTime;
    this.userDetails = userDetails;
  }

  public DeviceConnection(LocalDateTime connectionTime, UserDetailsImpl userDetails) {
    this.connectionTime = connectionTime;
    this.userDetails = userDetails;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public LocalDateTime getConnectionTime() {
    return connectionTime;
  }

  public void setConnectionTime(LocalDateTime connectionTime) {
    this.connectionTime = connectionTime;
  }

  public UserDetailsImpl getUserDetails() {
    return userDetails;
  }

  public void setUserDetails(UserDetailsImpl userDetails) {
    this.userDetails = userDetails;
  }
}
