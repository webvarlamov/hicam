import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebRtcConnectionStoreService {
  private webRtcConnections: { [key: string]: RTCPeerConnection } = {};

  constructor() { }

  public put(localDeviceSessionId: string, remoteDeviceSessionId: string, rtcPeerConnection: RTCPeerConnection) {
    const key = localDeviceSessionId + ":" + remoteDeviceSessionId;
    this.webRtcConnections[key] = rtcPeerConnection;

    console.group("[WebRtcConnectionStoreService]");
    console.info("RTCPeerConnections put: ", this.webRtcConnections)
    console.groupEnd();
  }

  public getBy(localDeviceSessionId: string, remoteDeviceSessionId: string) {
    const key = localDeviceSessionId + ":" + remoteDeviceSessionId;
    return this.webRtcConnections[key]
  }

  public get(key: string) {
    return this.webRtcConnections[key]
  }

  public getKeys(): string[] {
    return Object.keys(this.webRtcConnections)
  }

  public deleteBy(localDeviceSessionId: string, remoteDeviceSessionId: string) {
    const key = localDeviceSessionId + ":" + remoteDeviceSessionId;
    let webRtcConnection = this.webRtcConnections[key];
    webRtcConnection.close();
    delete this.webRtcConnections[key];

    console.group("[WebRtcConnectionStoreService]");
    console.info("RTCPeerConnections changed: ", this.webRtcConnections)
    console.groupEnd();
  }

  public closeAndDelete(key: string) {
    let webRtcConnection = this.webRtcConnections[key];
    webRtcConnection.close();
    delete this.webRtcConnections[key];

    console.group("[WebRtcConnectionStoreService]");
    console.info("RTCPeerConnections changed: ", this.webRtcConnections)
    console.groupEnd();
  }
}
