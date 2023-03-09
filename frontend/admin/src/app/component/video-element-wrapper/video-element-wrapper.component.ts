import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DeviceSession} from "../../model/device-session";

@Component({
  selector: 'video-element-wrapper',
  templateUrl: './video-element-wrapper.component.html',
  styleUrls: ['./video-element-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoElementWrapper implements OnInit, AfterViewInit {
  @Input()
  public videoElement: {id: string};

  constructor() {
  }

  ngOnInit(): void {
    // console.info("ngOnInit", this)
  }

  ngAfterViewInit(): void {

  }
}
