import { Injectable } from '@angular/core';
import {RemoteRTCPeerConnectionBuilderService} from "./remote-rtcpeer-connection-builder.service";

@Injectable({
  providedIn: 'root'
})
export class WebRtcService {
  private iceConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username: '28224511:1379330808'},
      { urls: 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username: '28224511:1379330808'}
    ]
  }

  private offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  };

  constructor(
    public remoteRTCPeerConnectionBuilder: RemoteRTCPeerConnectionBuilderService
  ) {}

  public connect(
    remoteDeviceId: string,
    localDeviceId: string,
    stream: MediaStream,
    callBack: {
      ontrack?: (event: RTCTrackEvent) => void
    }): Promise<RTCPeerConnection> {
    let localPeerConnection = new RTCPeerConnection(this.iceConfig);
    let remotePeerConnection = this.remoteRTCPeerConnectionBuilder.buildRemoteRTCPeerConnection(remoteDeviceId, localDeviceId);

    localPeerConnection.onicecandidate = (event) => {
      remotePeerConnection.addIceCandidate(event.candidate).then()
    }

    remotePeerConnection.onicecandidate = (event) => {
        localPeerConnection.addIceCandidate(event.candidate).then()
    }

    localPeerConnection.ontrack = (event) => {
      console.info("📺 Handle on track event:", localPeerConnection, event);
      callBack.ontrack(event)
    };

    if (stream != null) {
      stream.getTracks().forEach(track => localPeerConnection.addTrack(track, stream));
    }

    return localPeerConnection.createOffer(this.offerOptions).then(offer => {
      return localPeerConnection.setLocalDescription(offer).then(_void => {
        return remotePeerConnection.setRemoteDescription(offer).then(_void => {
          return remotePeerConnection.createAnswer().then(answer => {
            return remotePeerConnection.setLocalDescription(answer).then(_void => {
              return localPeerConnection.setRemoteDescription(answer).then(_void => {
                return localPeerConnection;
              })
            })
          })
        })
      })
    })
  }
}
