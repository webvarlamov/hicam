import {Injectable} from '@angular/core';
import {HttpClientService} from "./http-client.service";
import {firstValueFrom, map, Observable} from "rxjs";
import {DeviceConnectionStoreService} from "../store/device-connection-store.service";
import {DeviceSession} from "../model/device-session";

@Injectable({
  providedIn: 'root'
})
export class DeviceConnectionService {

  constructor(
    private httpClientService: HttpClientService,
    private deviceConnectionStoreService: DeviceConnectionStoreService
  ) {
  }
}
