import { Injectable } from '@angular/core';
import {RemoteRTCPeerConnectionBuilderService} from "./remote-rtcpeer-connection-builder.service";

@Injectable({
  providedIn: 'root'
})
export class WebRtcService {
  private config: RTCConfiguration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
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
    let localPeerConnection = new RTCPeerConnection(this.config);
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
