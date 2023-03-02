import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-device-connection-card',
  templateUrl: './device-connection-card.component.html',
  styleUrls: ['./device-connection-card.component.css']
})
export class DeviceConnectionCardComponent implements OnInit, AfterViewInit {
  @ViewChild('video', {static: true})
  public video: ElementRef<HTMLVideoElement> | null = null;
  @Input()
  public rtcPeerConnection: RTCPeerConnection | null;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.rtcPeerConnection != null) {
      this.rtcPeerConnection.ontrack = (event) => {
        if (this.video.nativeElement.srcObject !== event.streams[0]) {
          this.video.nativeElement.srcObject = event.streams[0];
        }
      }
    }
  }
}
