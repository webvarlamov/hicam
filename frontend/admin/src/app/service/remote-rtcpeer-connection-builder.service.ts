import {Injectable} from '@angular/core';
import {CommandSocketClientService} from "./command-socket-client.service";
import {HttpClientService} from "./http-client.service";
import {UUID} from "angular2-uuid";
import {filter, tap} from "rxjs/operators";
import {firstValueFrom, map} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class RemoteRTCPeerConnectionBuilderService {

  constructor(
    public commandSocketClientService: CommandSocketClientService,
    public httpClientService: HttpClientService
  ) {
  }

  public buildRemoteRTCPeerConnection(remoteDeviceId: string, localDeviceId: string): RemoteRTCPeerConnection {
    const remoteRTCPeerConnection = new RemoteRTCPeerConnection(remoteDeviceId, localDeviceId);

    remoteRTCPeerConnection.addIceCandidate = (candidate) => {
      const uuid = UUID.UUID();
      this.commandSocketClientService.passAddIceCandidate(remoteDeviceId, localDeviceId, uuid, candidate);

      return firstValueFrom(
        this.commandSocketClientService.message$.pipe(
          filter(message => message != null && message.id == uuid),
          tap(message => {
            // console.group("[RemoteRTCPeerConnection]");
            // console.info(localDeviceId + " => " + remoteDeviceId);
            // console.info("Success invoke addIceCandidate(...)");
            // console.groupEnd()
          })
        )
      ).then()
    }

    remoteRTCPeerConnection.setRemoteDescription = (descriptionInit: RTCSessionDescriptionInit) => {
      const uuid = UUID.UUID();
      this.commandSocketClientService.passSetRemoteDescriptionCommand(remoteDeviceId, localDeviceId, uuid, descriptionInit);

      return firstValueFrom(
        this.commandSocketClientService.message$.pipe(
          filter(message => message != null && message.id == uuid),
          tap(message => {
            // console.group("[RemoteRTCPeerConnection]");
            // console.info(localDeviceId + " => " + remoteDeviceId);
            // console.info("Success invoke setRemoteDescription(...)");
            // console.groupEnd()
          })
        )
      ).then(() => {
        remoteRTCPeerConnection.offer = descriptionInit;
      });
    }

    remoteRTCPeerConnection.createAnswer = () => {
      const uuid = UUID.UUID();
      this.commandSocketClientService.passCreateAnswerCommand(remoteDeviceId, localDeviceId, uuid);

      return firstValueFrom(
        this.commandSocketClientService.message$.pipe(
          filter(message => message != null && message.id == uuid),
          map(message => message.data),
          map(answer => answer as RTCSessionDescriptionInit),
          tap(message => {
            // console.group("[RemoteRTCPeerConnection]");
            // console.info(localDeviceId + " => " + remoteDeviceId);
            // console.info("Success invoke createAnswer(...)");
            // console.groupEnd()
          })
        )
      );
    }

    remoteRTCPeerConnection.setLocalDescription = (descriptionInit: RTCSessionDescriptionInit) => {
      const uuid = UUID.UUID();
      this.commandSocketClientService.passSetLocalDescriptionCommand(remoteDeviceId, localDeviceId, uuid, descriptionInit);

      return firstValueFrom(
        this.commandSocketClientService.message$.pipe(
          filter(message => message != null && message.id == uuid),
          tap(message => {
            // console.group("[RemoteRTCPeerConnection]");
            // console.info(localDeviceId + " => " + remoteDeviceId);
            // console.info("Success invoke setLocalDescription(...)");
            // console.groupEnd()
          })
        )
      ).then();
    }

    this.commandSocketClientService.message$
      .pipe(
        filter(message => message != null),
        filter(message => message.from === remoteDeviceId),
        filter(message => message.purpose === 'ADD_ICE_CANDIDATE')
      ).subscribe(message => {
      let event: RTCPeerConnectionIceEvent = message.data;

      // console.group("[RemoteRTCPeerConnection]");
      // console.info(remoteDeviceId + " => " + localDeviceId);
      // console.info("Receive new onicecandidate event");
      // console.groupEnd()

      remoteRTCPeerConnection.onicecandidate(event)
    })

    return remoteRTCPeerConnection;
  }
}

export class RemoteRTCPeerConnection {
  public offer: RTCSessionDescriptionInit;
  public answer: RTCSessionDescriptionInit;

  // @ts-ignore
  public setRemoteDescription: (offer: RTCSessionDescriptionInit) => Promise<void>;
  // @ts-ignore
  public setLocalDescription: (answer: RTCSessionDescriptionInit) => Promise<void>;
  // @ts-ignore
  public createAnswer: () => Promise<RTCSessionDescriptionInit>;

  public addIceCandidate: (candidate: RTCIceCandidate) => Promise<void>;

  public onicecandidate: (event: RTCPeerConnectionIceEvent) => void;

  constructor(
    private remoteDeviceId: string,
    private localDeviceId: string,
  ) {
  }
}
