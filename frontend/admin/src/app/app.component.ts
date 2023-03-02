import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {combineLatest, firstValueFrom, Observable, of, switchMap} from "rxjs";
import {CommandSocketClientService} from "./service/command-socket-client.service";
import {DeviceSession} from "./model/device-session";
import {tap} from "rxjs/operators";
import {WebRtcService} from "./service/web-rtc.service";
import {HttpClientService} from "./service/http-client.service";
import {DeviceSessionStoreService} from "./store/device-session-store.service";
import {DeviceSessionService} from "./service/device-session.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public deviceSessionList$: Observable<DeviceSession[]>;
  public showUserInfo: boolean;

  constructor(
    public deviceSessionStoreService: DeviceSessionStoreService,
    public deviceSessionService: DeviceSessionService,
    public commandSocketClientService: CommandSocketClientService,
    public httpClientService: HttpClientService,
    public webRtcService: WebRtcService,
  ) {
    this.deviceSessionList$ = deviceSessionStoreService.deviceSessionList$
  }

  ngAfterViewInit(): void {
    firstValueFrom(this.getInit$()).then();
  }

  public getInit$(): Observable<any> {
    return combineLatest([
      this.httpClientService.getDeviceId(),
      this.httpClientService.getDeviceSessionId(),
    ]).pipe(
      tap(([deviceId, deviceSessionId]) => {
        console.info("New tab with deviceId=" + deviceId + "; deviceSessionId=" + deviceSessionId + ";");
        this.commandSocketClientService.init(deviceId, deviceSessionId)
      }),
      switchMap(([deviceId, deviceSessionId]) => {
        return combineLatest([
          of(deviceSessionId),
          this.httpClientService.getDeviceSessions()
        ]);
      }),
      tap(([deviceSessionId, deviceSessions]) => {
        console.info("Remote device sessions received: ", deviceSessions)
      }),
      tap(([deviceSessionId, deviceSessions]) => {
        this.deviceSessionStoreService.setDeviceSessions(deviceSessions);
        deviceSessions.forEach(deviceSession => {
          this.webRtcService.connect(
            deviceSession.deviceSessionId,
            deviceSessionId,
            null,
            {
              ontrack: (event) => {
                (document.getElementById(deviceSession.deviceSessionId) as HTMLVideoElement).srcObject = event.streams[0];
              }
            }
          ).then(rtcPeerConnection => {
            console.info("👍 Success:", rtcPeerConnection);
          });
        })
      })
    );
  }

  onUserInfoDecline() {
    this.showUserInfo = false;
  }

  public trackByIdValue(index: number, item: DeviceSession) {
    return item.deviceSessionId
  };

}
