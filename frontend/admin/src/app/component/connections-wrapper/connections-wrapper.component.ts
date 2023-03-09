import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-connections-wrapper',
  templateUrl: './connections-wrapper.component.html',
  styleUrls: ['./connections-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionsWrapperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
