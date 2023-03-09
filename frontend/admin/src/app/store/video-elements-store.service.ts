import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoElementsStoreService {
  private videoElements: {id: string}[] = [
    {id: "1-device-video"},
    {id: "2-device-video"},
    {id: "3-device-video"},
    {id: "4-device-video"},
    {id: "5-device-video"},
    {id: "6-device-video"},
    {id: "7-device-video"},
    {id: "8-device-video"},
    {id: "9-device-video"},
    {id: "10-device-video"},
    {id: "11-device-video"},
    {id: "12-device-video"},
  ];

  private deviceSessionIdToVideoElementId: {[key: string]: string} = {}

  constructor() { }

  public appointVideoElementId(deviceSessionId: string) {
    const values = Object.values(this.deviceSessionIdToVideoElementId);
    const firstFreeVideoElement = this.videoElements.find(videoElement => {
      return !values.includes(videoElement.id)
    });
    this.deviceSessionIdToVideoElementId[deviceSessionId] = firstFreeVideoElement.id
  }

  public getVideoElementId(deviceSessionId: string): string {
    return this.deviceSessionIdToVideoElementId[deviceSessionId]
  }

  public getVideoElements() {
    return this.videoElements;
  }

  public exemptByDeviceSessionId(remoteDeviceSessionId: string) {
    delete this.deviceSessionIdToVideoElementId[remoteDeviceSessionId];
  }
}
