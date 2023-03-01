import {Component, OnInit} from '@angular/core';
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
        map(([deviceSessionId, deviceSessions]) => {
          deviceSessions.forEach(deviceSession => {
            this.webRtcService.connect(deviceSession.deviceSessionId, deviceSessionId, null)
              .then(rtcPeerConnection => console.info("RtcPeerConnection success:", rtcPeerConnection));
          })
        })
      );

      firstValueFrom(init$)
        .then()

    // navigator.mediaDevices.getUserMedia({audio: false, video: true}).then(stream => {
    //   this.webRtcService.connect("2", "1", stream).then(_void => {
    //   })
    // })
    // this.deviceConnectionService.loadDeviceConnectionList()
    //   .pipe(
    //     tap(deviceConnections => {
    //       this.deviceConnectionStoreService.setDeviceConnections(deviceConnections)
    //     }),
    //     map(deviceConnections => {
    //       const peerConnections: { [id: string]: RTCPeerConnection } = {};
    //       Object.keys(deviceConnections).forEach(key => {
    //         peerConnections[key] = this.peerConnectionService.getPeerConnection()
    //       })
    //
    //       this.peerConnectionsStoreService.setPeerConnections(peerConnections)
    //
    //       return {
    //         deviceConnections,
    //         peerConnections
    //       }
    //     }),
    //     switchMap(connections => {
    //       const peerConnections = connections.peerConnections;
    //       const deviceConnections = connections.deviceConnections;
    //       const answers: {[id: string]: RTCSessionDescriptionInit} = {};
    //
    //       const answerPromises = Object
    //         .keys(peerConnections)
    //         .map(key => {
    //           const peerConnection = peerConnections[key];
    //           const offer = JSON.parse(deviceConnections[key].offer);
    //
    //           return this.peerConnectionService.setRemoteDescriptionAndCreateAnswer(peerConnection, offer).then(answer => {
    //             answers[key] = answer;
    //             return true;
    //           })
    //         });
    //
    //       return combineLatest([of(answers), of(peerConnections), of(deviceConnections), forkJoin(answerPromises)])
    //     }),
    //     tap(latest => {
    //       const answers = latest[0];
    //       Object.keys(answers).forEach(key => {
    //         this.webSocketService.sendAnswerToRemote(key, answers[key])
    //       })
    //     })
    //   ).subscribe();
  }

  onUserInfoDecline() {
    this.showUserInfo = false;
  }
}
