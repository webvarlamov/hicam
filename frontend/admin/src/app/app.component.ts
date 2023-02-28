import {Component, OnInit} from '@angular/core';
import {DeviceConnectionService} from "./service/device-connection.service";
import {combineLatest, forkJoin, map, Observable, of, switchMap} from "rxjs";
import {DeviceConnectionStoreService} from "./store/device-connection-store.service";
import {PeerConnectionsStoreService} from "./store/peer-connections-store.service";
import {WebSocketService} from "./service/web-socket.service";
import {PeerConnectionService} from "./service/peer-connection.service";
import {DeviceConnection} from "./model/device-connection";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public deviceConnectionListCardsData$: Observable<{ rtcPeerConnection: RTCPeerConnection, deviceConnection: DeviceConnection }[]>
  public showUserInfo: boolean;

  constructor(
    public deviceConnectionService: DeviceConnectionService,
    public deviceConnectionStoreService: DeviceConnectionStoreService,
    public peerConnectionsStoreService: PeerConnectionsStoreService,
    public peerConnectionService: PeerConnectionService,
    public webSocketService: WebSocketService
  ) {
  }

  ngOnInit(): void {
    this.deviceConnectionService.loadDeviceConnectionList()
      .pipe(
        tap(deviceConnections => {
          this.deviceConnectionStoreService.setDeviceConnections(deviceConnections)
        }),
        map(deviceConnections => {
          const peerConnections: { [id: string]: RTCPeerConnection } = {};
          Object.keys(deviceConnections).forEach(key => {
            peerConnections[key] = this.peerConnectionService.getPeerConnection()
          })

          this.peerConnectionsStoreService.setPeerConnections(peerConnections)

          return {
            deviceConnections,
            peerConnections
          }
        }),
        switchMap(connections => {
          const peerConnections = connections.peerConnections;
          const deviceConnections = connections.deviceConnections;
          const answers: {[id: string]: RTCSessionDescriptionInit} = {};

          const answerPromises = Object
            .keys(peerConnections)
            .map(key => {
              const peerConnection = peerConnections[key];
              const offer = JSON.parse(deviceConnections[key].offer);

              return this.peerConnectionService.setRemoteDescriptionAndCreateAnswer(peerConnection, offer).then(answer => {
                answers[key] = answer;
                return true;
              })
            });

          return combineLatest([of(answers), of(peerConnections), of(deviceConnections), forkJoin(answerPromises)])
        }),
        tap(latest => {
          const answers = latest[0];
          Object.keys(answers).forEach(key => {
            this.webSocketService.sendAnswerToRemote(key, answers[key])
          })
        })
      ).subscribe();
  }

  onUserInfoDecline() {
    this.showUserInfo = false;
  }
}
