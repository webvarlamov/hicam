import { Injectable } from '@angular/core';
import {DeviceSession} from "../model/device-session";
import {PeerConnectionsStoreService} from "../store/peer-connections-store.service";
import {flatMap, map, of, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PeerConnectionService {
  private iceConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username: '28224511:1379330808'},
      { urls: 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username: '28224511:1379330808'}
    ]
  }

  constructor(
    public peerConnectionsStoreService: PeerConnectionsStoreService
  ) { }

  public getPeerConnection(): RTCPeerConnection {
    let rtcPeerConnection: RTCPeerConnection = new RTCPeerConnection(this.iceConfig);

    rtcPeerConnection.onicecandidate = (event) => {
      console.info('onicecandidate', event)
      // this.getRemoteDeviceUUID().then(uuid => {
      //   this.commandSocketService.sendReceiveCandidateCommand(uuid, event.candidate);
      // })
    }

    // rtcPeerConnection.ontrack = (event) => {
    //   console.info('ontrack', event)
    //   // let remoteVideoElement = this.getRemoteVideoElement();
    //   // if (remoteVideoElement.srcObject !== event.streams[0]) {
    //   //   remoteVideoElement.srcObject = event.streams[0];
    //   // }
    // }

    rtcPeerConnection.onicecandidateerror = (event) => {
      console.info('onicecandidateerror', event)
    }

    rtcPeerConnection.onconnectionstatechange = (event) => {
      console.info('onconnectionstatechange', event)
    }

    rtcPeerConnection.onnegotiationneeded = (event) => {
      console.info('onnegotiationneeded', event)
    }

    rtcPeerConnection.ondatachannel = (event) => {
      console.info('ondatachannel', event)
    }

    rtcPeerConnection.onicegatheringstatechange = (event) => {
      console.info('onicegatheringstatechange', event)
    }

    rtcPeerConnection.onsignalingstatechange = (event) => {
      console.info('onsignalingstatechange', event)
    }

    return rtcPeerConnection;
  }

  public setRemoteDescriptionAndCreateAnswer(rtcPeerConnection: RTCPeerConnection, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    return rtcPeerConnection.setRemoteDescription(offer).then(() => {
      return rtcPeerConnection.createAnswer().then(answer => {
        return rtcPeerConnection.setLocalDescription(answer).then(() => {
          return answer;
        })
      })
    })
  }
}
