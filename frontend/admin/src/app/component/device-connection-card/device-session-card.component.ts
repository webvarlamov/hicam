import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {DeviceSession} from "../../model/device-session";

@Component({
  selector: 'app-device-session-card',
  templateUrl: './device-session-card.component.html',
  styleUrls: ['./device-session-card.component.css']
})
export class DeviceSessionCardComponent implements OnInit, AfterViewInit {
  @Input()
  public deviceSession: DeviceSession;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }
}
