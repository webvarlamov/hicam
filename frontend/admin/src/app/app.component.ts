import {Component, OnInit} from '@angular/core';
import {DeviceConnectionService} from "./service/device-connection.service";
import {Observable} from "rxjs";
import {DeviceConnectionStoreService} from "./store/device-connection-store.service";
import {PeerConnectionsStoreService} from "./store/peer-connections-store.service";
import {WebSocketServiceService} from "./service/web-socket-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public deviceConnectionListCardsData$: Observable<any>
  public showUserInfo: boolean;

  constructor(
    private deviceConnectionService: DeviceConnectionService,
    private deviceConnectionStoreService: DeviceConnectionStoreService,
    private peerConnectionsStoreService: PeerConnectionsStoreService,
    private webSocketServiceService: WebSocketServiceService
  ) {
    this.deviceConnectionListCardsData$ = deviceConnectionStoreService.deviceConnectionList$.pipe();
  }

  ngOnInit(): void {
    this.deviceConnectionService
      .updateDeviceConnectionList();
  }

  onUserInfoDecline() {
    this.showUserInfo = false;
  }
}
