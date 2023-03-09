import {ChangeDetectionStrategy, Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-device-connection-link-modal',
  templateUrl: './device-connection-link-modal.component.html',
  styleUrls: ['./device-connection-link-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceConnectionLinkModalComponent implements OnInit {
  @Output()
  onDecline: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('click', ['$event.target'])
  public myClick(){
    this.onDecline.emit();
  }
}
