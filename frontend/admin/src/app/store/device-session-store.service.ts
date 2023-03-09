import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {DeviceSession} from "../model/device-session";

@Injectable({
  providedIn: 'root'
})
export class DeviceSessionStoreService {
  public deviceSessions$: BehaviorSubject<DeviceSession[]> = new BehaviorSubject<DeviceSession[]>([]);
  public selectedDeviceSession$: BehaviorSubject<DeviceSession | null> = new BehaviorSubject<DeviceSession | null>(null);

  constructor() { }

  public setDeviceSessions(deviceConnections: DeviceSession[]) {
    this.deviceSessions$.next(deviceConnections)
  }

  public getDeviceSessions(): DeviceSession[] {
    return this.deviceSessions$.getValue();
  }

  public setSelectedDeviceSession(deviceConnection: DeviceSession) {
    this.selectedDeviceSession$.next(deviceConnection)
  }
}
