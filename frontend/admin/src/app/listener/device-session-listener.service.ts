import {Injectable} from '@angular/core';
import {CommandSocketClientService, CommandSocketTextMessage, CommandSocketTextMessagePurpose} from "../service/command-socket-client.service";
import {Subscription} from "rxjs";
import {filter, tap} from "rxjs/operators";
import {DeviceSessionService} from "../service/device-session.service";
import {WebRtcConnectionService} from "../service/web-rtc-connection.service";
import {VideoElementsStoreService} from "../store/video-elements-store.service";

@Injectable({
  providedIn: 'root'
})
export class DeviceSessionListenerService {
  private commandSocketClientServiceMessageSubscription: Subscription | null = null;
  private observedPurposes: CommandSocketTextMessagePurpose[] = [
    CommandSocketTextMessagePurpose.SOME_WEB_SOCKET_SESSION_CONNECTION_CLOSED,
    CommandSocketTextMessagePurpose.SOME_WEB_SOCKET_SESSION_CONNECTION_ESTABLISHED
  ];

  constructor(
    private commandSocketClientService: CommandSocketClientService,
    private deviceSessionService: DeviceSessionService,
    private webRtcConnectionService: WebRtcConnectionService,
    private videoElementsStoreService: VideoElementsStoreService
  ) {
    this.commandSocketClientServiceMessageSubscription =
      this.commandSocketClientService.message$.pipe(
        filter(message => message != null),
        filter(message => this.observedPurposes.includes(message.purpose)),
        tap(message => this.onMessage(message)),
      ).subscribe();
  }

  private onMessage(message: CommandSocketTextMessage) {
    switch (message.purpose) {
      case CommandSocketTextMessagePurpose.SOME_WEB_SOCKET_SESSION_CONNECTION_CLOSED: {
        let remoteDeviceSessionId = message.data;
        let deviceSessions = this.deviceSessionService.onDeviceSessionClosed(remoteDeviceSessionId);
        this.videoElementsStoreService.exemptByDeviceSessionId(remoteDeviceSessionId);
        this.webRtcConnectionService.onDeviceSessionsConnectionClosed(deviceSessions, remoteDeviceSessionId)
        break;
      }
      case CommandSocketTextMessagePurpose.SOME_WEB_SOCKET_SESSION_CONNECTION_ESTABLISHED: {
        let remoteDeviceSessionId = message.data;
        this.deviceSessionService.onDeviceSessionEstablished(remoteDeviceSessionId)
          .then((currentDeviceSessions) => {
            this.videoElementsStoreService.appointVideoElementId(remoteDeviceSessionId)
            this.webRtcConnectionService.onDeviceSessionsConnectionEstablished(currentDeviceSessions, remoteDeviceSessionId)
          })
        break;
      }
    }
  }
}

