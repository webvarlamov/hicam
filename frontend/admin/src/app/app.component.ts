import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DeviceConnectionService} from "./service/device-connection.service";
import {combineLatest, firstValueFrom, flatMap, forkJoin, map, Observable, of, switchMap} from "rxjs";
import {DeviceConnectionStoreService} from "./store/device-connection-store.service";
import {PeerConnectionsStoreService} from "./store/peer-connections-store.service";
import {CommandSocketClientService} from "./service/command-socket-client.service";
import {PeerConnectionService} from "./service/peer-connection.service";
import {DeviceSession} from "./model/device-session";
import {tap} from "rxjs/operators";
import {WebRtcService} from "./service/web-rtc.service";
import {HttpClientService} from "./service/http-client.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public deviceConnectionListCardsData$: Observable<{ rtcPeerConnection: RTCPeerConnection, deviceConnection: DeviceSession }[]>
  public showUserInfo: boolean;
  @ViewChild('video', {static: true})
  public video: ElementRef<HTMLVideoElement> | null = null;

  constructor(
    public commandSocketClientService: CommandSocketClientService,
    public httpClientService: HttpClientService,
    public webRtcService: WebRtcService
  ) {
  }

  ngOnInit(): void {
    const init$ = combineLatest([
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
        deviceSessions.forEach(deviceSession => {
          this.webRtcService.connect(
            deviceSession.deviceSessionId,
            deviceSessionId,
            null,
            {
              ontrack: (event) => {
                this.video.nativeElement.srcObject = event.streams[0];
              }
            }
          ).then(rtcPeerConnection => {
            console.info("👍 Success:", rtcPeerConnection);
          });
        })
      })
    );

    firstValueFrom(init$).then()
  }

  onUserInfoDecline() {
    this.showUserInfo = false;
  }
}
