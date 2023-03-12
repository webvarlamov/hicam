import { Injectable } from '@angular/core';
import {BehaviorSubject, firstValueFrom, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommandSocketClientService {
  public commandSocket: WebSocket;
  public message$: BehaviorSubject<CommandSocketTextMessage> = new BehaviorSubject<CommandSocketTextMessage>(null);

  constructor() {
  }

  public sendAnswerToRemote(destinationDeviceConnectionId: string, answer: RTCSessionDescriptionInit) {
    this.commandSocket.send(JSON.stringify({
      type: "ADD_ANSWER",
      data: JSON.stringify({
        destinationDeviceConnectionId,
        answer: JSON.stringify(answer)
      })
    }));
  }

  public passSetRemoteDescriptionCommand(remoteDeviceId: string, localDeviceId: string, commandId: string, descriptionInit: RTCSessionDescriptionInit) {
    const command: CommandSocketTextMessage = {
      id: commandId,
      mission: CommandSocketTextMessageMission.PASS_RTC_PEER_CONNECTION_COMMAND,
      purpose: CommandSocketTextMessagePurpose.SET_REMOTE_DESCRIPTION,
      from: localDeviceId,
      to: remoteDeviceId,
      data: descriptionInit
    }

    this.commandSocket.send(JSON.stringify(command))
  }

  public passCreateAnswerCommand(remoteDeviceId: string, localDeviceId: string, commandId: string) {
    const command: CommandSocketTextMessage = {
      id: commandId,
      mission: CommandSocketTextMessageMission.PASS_RTC_PEER_CONNECTION_COMMAND,
      purpose: CommandSocketTextMessagePurpose.CREATE_ANSWER,
      from: localDeviceId,
      to: remoteDeviceId,
      data: "{}"
    }

    this.commandSocket.send(JSON.stringify(command))
  }

  public passSetLocalDescriptionCommand(remoteDeviceId: string, localDeviceId: string, commandId: string, descriptionInit: RTCSessionDescriptionInit) {
    const command: CommandSocketTextMessage = {
      id: commandId,
      mission: CommandSocketTextMessageMission.PASS_RTC_PEER_CONNECTION_COMMAND,
      purpose: CommandSocketTextMessagePurpose.SET_LOCAL_DESCRIPTION,
      from: localDeviceId,
      to: remoteDeviceId,
      data: descriptionInit
    }

    this.commandSocket.send(JSON.stringify(command))
  }

  public passAddIceCandidate(remoteDeviceId: string, localDeviceId: string, commandId: string, candidate: RTCIceCandidate) {
    const command: CommandSocketTextMessage = {
      id: commandId,
      mission: CommandSocketTextMessageMission.PASS_RTC_PEER_CONNECTION_COMMAND,
      purpose: CommandSocketTextMessagePurpose.ADD_ICE_CANDIDATE,
      from: localDeviceId,
      to: remoteDeviceId,
      data: candidate
    }

    this.commandSocket.send(JSON.stringify(command))
  }

  public createWebSocketSession(deviceId: string, deviceSessionId: string): Promise<void> {
    this.commandSocket = new WebSocket(`${this.getProtocol()}//${location.hostname}${this.getPort()}/` +
        "command-socket?deviceType=ADMIN&deviceId=" + deviceId +
        "&deviceSessionId=" + deviceSessionId
    );

    this.commandSocket.onmessage = (event) => {
      const message: CommandSocketTextMessage = JSON.parse(event.data);
      this.message$.next(message);
    }

    const onOpenSubject = new Subject<void>();
    this.commandSocket.onopen = (event) => {
      console.info("Command socket connection is OPEN:", event)
      onOpenSubject.next();
    }

    return firstValueFrom(onOpenSubject)
  }

  private getProtocol(): string {
    if (location.protocol === 'https:') {
      return 'wss:'
    } else {
      return 'ws:'
    }
  }

  private getPort(): string {
    if(location.port.length != 0) {
      return ':' + location.port
    } else {
      return ''
    }
  }
}

export interface CommandSocketTextMessage {
  id: string;
  mission: CommandSocketTextMessageMission;
  purpose: CommandSocketTextMessagePurpose;
  from: string;
  to: string;
  data: any;
}

export enum CommandSocketTextMessageMission {
  PASS_RTC_PEER_CONNECTION_COMMAND = 'PASS_RTC_PEER_CONNECTION_COMMAND'
}

export enum CommandSocketTextMessagePurpose {
  ACCEPT_OFFER = "ACCEPT_OFFER",
  ACCEPT_OFFER__SUCCESS  = "ACCEPT_OFFER__SUCCESS",

  ADD_ICE_CANDIDATE = "ADD_ICE_CANDIDATE",
  ADD_ICE_CANDIDATE__SUCCESS = "ADD_ICE_CANDIDATE__SUCCESS",

  SET_REMOTE_DESCRIPTION = "SET_REMOTE_DESCRIPTION",
  SET_REMOTE_DESCRIPTION__SUCCESS = "SET_REMOTE_DESCRIPTION__SUCCESS",

  CREATE_ANSWER = "CREATE_ANSWER",
  CREATE_ANSWER__SUCCESS = "CREATE_ANSWER__SUCCESS",

  SET_LOCAL_DESCRIPTION = "SET_LOCAL_DESCRIPTION",
  SET_LOCAL_DESCRIPTION__SUCCESS = "SET_LOCAL_DESCRIPTION__SUCCESS",

  SOME_WEB_SOCKET_SESSION_CONNECTION_ESTABLISHED = "SOME_WEB_SOCKET_SESSION_CONNECTION_ESTABLISHED",
  SOME_WEB_SOCKET_SESSION_CONNECTION_CLOSED = "SOME_WEB_SOCKET_SESSION_CONNECTION_CLOSED"
}
