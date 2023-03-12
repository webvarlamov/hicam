import {AfterViewInit, Component} from '@angular/core';
import {combineLatest, delay, firstValueFrom, Observable, of, switchMap} from "rxjs";
import {CommandSocketClientService} from "./service/command-socket-client.service";
import {DeviceSession} from "./model/device-session";
import {tap} from "rxjs/operators";
import {WebRtcConnectionService} from "./service/web-rtc-connection.service";
import {HttpClientService} from "./service/http-client.service";
import {DeviceSessionStoreService} from "./store/device-session-store.service";
import {DeviceSessionListenerService} from "./listener/device-session-listener.service";
import {WebRtcConnectionStoreService} from "./store/web-rtc-connection-store.service";
import {VideoElementsStoreService} from "./store/video-elements-store.service";
import {UserInfoService} from "./service/user-info.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public deviceSessionList$: Observable<DeviceSession[]>;
  public showDeviceConnectionModal: boolean;

  constructor(
    public deviceSessionListenerService: DeviceSessionListenerService,
    public deviceSessionStoreService: DeviceSessionStoreService,
    public commandSocketClientService: CommandSocketClientService,
    public httpClientService: HttpClientService,
    public webRtcService: WebRtcConnectionService,
    public webRtcConnectionStoreService: WebRtcConnectionStoreService,
    public videoElementsStoreService: VideoElementsStoreService,
    public userInfoService: UserInfoService
  ) {
    this.deviceSessionList$ = deviceSessionStoreService.deviceSessions$
  }

  ngAfterViewInit(): void {
    firstValueFrom(this.getInit$()).then();
  }

  public getInit$(): Observable<any> {
    return combineLatest([
      this.httpClientService.getDeviceId(),
      this.httpClientService.getDeviceSessionId(),
    ]).pipe(
      delay(2000),
      tap(([deviceId, deviceSessionId]) => {
        console.info("New tab with deviceId=" + deviceId + "; deviceSessionId=" + deviceSessionId + ";");
        localStorage.setItem("deviceId", deviceId);
        localStorage.setItem("deviceSessionId", deviceSessionId);
      }),
      switchMap(([deviceId, deviceSessionId]) => {
        return combineLatest([
            of(deviceSessionId),
            this.commandSocketClientService.createWebSocketSession(deviceId, deviceSessionId)
        ])
      }),
      switchMap(([deviceSessionId, onOpen]) => {
        return combineLatest([
          of(deviceSessionId),
          this.httpClientService.getDeviceSessions()
        ]);
      }),
      tap(([localDeviceSessionId, deviceSessions]) => {
        console.info("Remote device sessions received: ", deviceSessions)
      }),
      tap(([localDeviceSessionId, deviceSessions]) => {
        deviceSessions.forEach(deviceSession => {
          this.videoElementsStoreService.appointVideoElementId(deviceSession.deviceSessionId)
        });
      }),
      tap(([localDeviceSessionId, deviceSessions]) => {
        this.deviceSessionStoreService.setDeviceSessions(deviceSessions);

        deviceSessions.forEach(remoteDeviceSession => {
          const remoteDeviceSessionId = remoteDeviceSession.deviceSessionId;

          const callback = {
            ontrack: (event: RTCTrackEvent) => {
              const video = document.getElementById(
                this.videoElementsStoreService.getVideoElementId(remoteDeviceSession.deviceSessionId)
              ) as HTMLVideoElement;

              video.srcObject = event.streams[0];
              video.play().then();
            }
          }

          this.webRtcService.connect(remoteDeviceSessionId, localDeviceSessionId, null, callback)
            .then(rtcPeerConnection => {
              console.info("👍 Success:", rtcPeerConnection);
              this.webRtcConnectionStoreService.put(localDeviceSessionId, remoteDeviceSessionId, rtcPeerConnection)
            });
        })
      })
    );
  }

  public onUserInfoDecline() {
    this.showDeviceConnectionModal = false;
  }

  public onConnectDeviceButtonClick() {
    this.showDeviceConnectionModal = true;
  }
}
