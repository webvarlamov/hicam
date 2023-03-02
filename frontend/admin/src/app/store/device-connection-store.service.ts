import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {DeviceSession} from "../model/device-session";

@Injectable({
  providedIn: 'root'
})
export class DeviceConnectionStoreService {
  public deviceConnectionList$: BehaviorSubject<{[id: string]: DeviceSession}> = new BehaviorSubject<{[id: string]: DeviceSession}>({});
  public selectedDeviceConnection$: BehaviorSubject<DeviceSession | null> = new BehaviorSubject<DeviceSession | null>(null);

  constructor() { }

  public setDeviceConnections(deviceConnections: {[id: string]: DeviceSession}) {
    this.deviceConnectionList$.next(deviceConnections)
  }

  public setSelectedDeviceConnection(deviceConnection: DeviceSession) {
    this.selectedDeviceConnection$.next(deviceConnection)
  }
}
