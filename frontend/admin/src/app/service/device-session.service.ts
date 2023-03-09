import {Injectable} from '@angular/core';
import {DeviceSessionStoreService} from "../store/device-session-store.service";
import {firstValueFrom} from "rxjs";
import {HttpClientService} from "./http-client.service";
import {DeviceSession} from "../model/device-session";

@Injectable({
  providedIn: 'root'
})
export class DeviceSessionService {

  constructor(
    private deviceSessionStoreService: DeviceSessionStoreService,
    private httpClientService: HttpClientService
  ) {
  }

  public onDeviceSessionClosed(remoteDeviceSessionId: string): DeviceSession[] {
    const deviceSessions = this.deviceSessionStoreService.getDeviceSessions().filter(deviceSession => {
      return deviceSession.deviceSessionId !== remoteDeviceSessionId
    });
    this.deviceSessionStoreService.setDeviceSessions(deviceSessions);
    return deviceSessions;
  }

  public onDeviceSessionEstablished(remoteDeviceSessionId: string): Promise<DeviceSession[]> {
    return firstValueFrom(
      this.httpClientService.getDeviceSessions()
    ).then(deviceSessions => {
      this.deviceSessionStoreService.setDeviceSessions(deviceSessions);
      return this.deviceSessionStoreService.getDeviceSessions();
    });
  }
}
