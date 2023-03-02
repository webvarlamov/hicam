import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {DeviceSession} from "../model/device-session";

@Injectable({
  providedIn: 'root'
})
export class DeviceSessionStoreService {
  public deviceSessionList$: BehaviorSubject<DeviceSession[]> = new BehaviorSubject<DeviceSession[]>([]);
  public selectedDeviceSession$: BehaviorSubject<DeviceSession | null> = new BehaviorSubject<DeviceSession | null>(null);

  constructor() { }

  public setDeviceSessions(deviceConnections: DeviceSession[]) {
    this.deviceSessionList$.next(deviceConnections)
  }

  public setSelectedDeviceSession(deviceConnection: DeviceSession) {
    this.selectedDeviceSession$.next(deviceConnection)
  }
}
