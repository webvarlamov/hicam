export interface DeviceSession {
  deviceId: string;
  deviceSessionId: string;
  deviceType: string;
}

export enum DeviceType {
  ADMIN,
  REMOTE
}
