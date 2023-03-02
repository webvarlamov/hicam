import {Injectable} from '@angular/core';
import {HttpClientService} from "./http-client.service";
import {CommandSocketClientService, CommandSocketTextMessage, CommandSocketTextMessagePurpose} from "./command-socket-client.service";
import {debounceTime, firstValueFrom, Subscription} from "rxjs";
import {filter, tap} from "rxjs/operators";
import {DeviceSessionStoreService} from "../store/device-session-store.service";

@Injectable({
  providedIn: 'root'
})
export class DeviceSessionService {
  private commandSocketClientServiceMessageSubscription: Subscription | null = null;
  private observedPurposes: CommandSocketTextMessagePurpose[] = [
    CommandSocketTextMessagePurpose.SOME_WEB_SOCKET_SESSION_CONNECTION_CLOSED,
    CommandSocketTextMessagePurpose.SOME_WEB_SOCKET_SESSION_CONNECTION_ESTABLISHED
  ];

  constructor(
    private httpClientService: HttpClientService,
    private deviceConnectionStoreService: DeviceSessionStoreService,
    private commandSocketClientService: CommandSocketClientService,
  ) {
    this.commandSocketClientServiceMessageSubscription =
      this.commandSocketClientService.message$.pipe(
        filter(message => message != null),
        filter(message => this.observedPurposes.includes(message.purpose)),
        debounceTime(500),
        tap(message => this.onMessage(message)),
      ).subscribe();
  }

  private onMessage(message: CommandSocketTextMessage) {
    firstValueFrom(
      this.httpClientService.getDeviceSessions()
    ).then(deviceSessions => {
      this.deviceConnectionStoreService.setDeviceSessions(deviceSessions)
    })
  }
}

