import { Injectable } from '@angular/core';
import {HttpClientService} from "./http-client.service";
import {Observable} from "rxjs";
import {UserMineDto} from "../model/user-mine-dto";

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  public userMine$: Observable<UserMineDto>;

  constructor(
    public httpClientService: HttpClientService
  ) {
    this.userMine$ = this.httpClientService.getUserInfo();
  }
}
