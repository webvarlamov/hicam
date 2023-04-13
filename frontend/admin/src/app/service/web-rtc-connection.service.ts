import {Injectable} from '@angular/core';
import {RemoteRTCPeerConnectionBuilderService} from "./remote-rtcpeer-connection-builder.service";
import {WebRtcConnectionStoreService} from "../store/web-rtc-connection-store.service";
import {DeviceSession} from "../model/device-session";
import {VideoElementsStoreService} from "../store/video-elements-store.service";

@Injectable({
  providedIn: 'root'
})
export class WebRtcConnectionService {
  private iceConfig = {
    iceServers: [
      {urls: 'turn:158.160.52.146:3478?transport=udp'}
    ]
  }

  private offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  };

  constructor(
    private remoteRTCPeerConnectionBuilder: RemoteRTCPeerConnectionBuilderService,
    private webRtcConnectionStoreService: WebRtcConnectionStoreService,
    private videoElementsStoreService: VideoElementsStoreService
  ) {
  }

  public connect(
    remoteDeviceSessionId: string,
    localDeviceSessionId: string,
    stream: MediaStream,
    callBack: {
      ontrack?: (event: RTCTrackEvent) => void
    }): Promise<RTCPeerConnection> {

    let localPeerConnection = new RTCPeerConnection(this.iceConfig);
    let remotePeerConnection = this.remoteRTCPeerConnectionBuilder.buildRemoteRTCPeerConnection(remoteDeviceSessionId, localDeviceSessionId);

    localPeerConnection.onicecandidate = (event) => {
      remotePeerConnection.addIceCandidate(event.candidate).then()
    }

    remotePeerConnection.onicecandidate = (event) => {
      localPeerConnection.addIceCandidate(event.candidate).then()
    }

    localPeerConnection.ontrack = (event) => {
      callBack.ontrack(event)
    };

    localPeerConnection.onicecandidateerror = (event) => {
      console.error(event)
    }

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

  public onDeviceSessionsConnectionClosed(deviceSessions: DeviceSession[], remoteDeviceSessionId: string) {
    const peerConnectionsKeys: string[] = this.webRtcConnectionStoreService.getKeys();
    const keyForRtcSessionClose: string[] = peerConnectionsKeys.filter(key => key.includes(remoteDeviceSessionId));

    keyForRtcSessionClose.forEach(key => {
      console.info("Delete peerConnection: ", key)
      this.webRtcConnectionStoreService.closeAndDelete(key);
    })
  }

  public onDeviceSessionsConnectionEstablished(deviceSessions: DeviceSession[], remoteDeviceSessionId: any) {
    const localDeviceSessionId = localStorage.getItem("deviceSessionId")
    const callback = {
      ontrack: (event: RTCTrackEvent) => {
        (document.getElementById(
          this.videoElementsStoreService.getVideoElementId(remoteDeviceSessionId)
        ) as HTMLVideoElement).srcObject = event.streams[0];
      }
    }

    this.connect(remoteDeviceSessionId, localDeviceSessionId, null, callback).then(rtcPeerConnection => {
        console.info("👍 Success:", rtcPeerConnection);
        this.webRtcConnectionStoreService.put(localDeviceSessionId, remoteDeviceSessionId, rtcPeerConnection)
    })
  }
}
