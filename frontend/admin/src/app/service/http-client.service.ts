import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DeviceSession} from "../model/device-session";
import {UserMineDto} from "../model/user-mine-dto";

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private http: HttpClient
  ) { }

  public getDeviceId(): Observable<string> {
    return this.http.get("/handshake_api/get_device_id?deviceType=ADMIN", {responseType: "text"}) as Observable<string>
  }

  public getDeviceSessionId(): Observable<string> {
    return this.http.get("/handshake_api/get_device_session_id?deviceType=ADMIN", {responseType: "text"}) as Observable<string>
  }

  public getDeviceSessions(): Observable<DeviceSession[]> {
    return this.http.get("/admin_api/get_device_sessions") as Observable<DeviceSession[]>
  }

  public getTokenLink(): Observable<string> {
    return this.http.get("/admin_api/generate_token_link") as Observable<string>
  }

  public getUserInfo(): Observable<UserMineDto> {
    return this.http.get("/user_api/mine") as Observable<UserMineDto>
  }
}
