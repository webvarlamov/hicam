import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PeerConnectionsStoreService {
  public connectionsMap: BehaviorSubject<{[id: string]: RTCPeerConnection}> = new BehaviorSubject<{[id: string]: RTCPeerConnection}>({});
  constructor() { }

  public setPeerConnections(connections: {[id: string]: RTCPeerConnection}) {
    this.connectionsMap.next(connections);
  }
}
