export class DeviceConnection {
  public id: string | undefined;
  public connectionTime: string | undefined;

  constructor(id: string, connectionTime: string) {
    this.id = id;
    this.connectionTime = connectionTime;
  }
}
