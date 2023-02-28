export class DeviceConnection {
  private _deviceConnectionId: string;
  private _deviceConnectionType: DeviceConnectionType;
  private _offer: string;

  constructor(deviceConnectionId: string, deviceConnectionType: DeviceConnectionType, offer: string) {
    this._deviceConnectionId = deviceConnectionId;
    this._deviceConnectionType = deviceConnectionType;
    this._offer = offer;
  }


  get deviceConnectionId(): string {
    return this._deviceConnectionId;
  }

  set deviceConnectionId(value: string) {
    this._deviceConnectionId = value;
  }

  get deviceConnectionType(): DeviceConnectionType {
    return this._deviceConnectionType;
  }

  set deviceConnectionType(value: DeviceConnectionType) {
    this._deviceConnectionType = value;
  }

  get offer(): string {
    return this._offer;
  }

  set offer(value: string) {
    this._offer = value;
  }
}

export enum DeviceConnectionType {
  ADMIN,
  REMOTE
}
