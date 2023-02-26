import {Directive, Input} from '@angular/core';
import {ModalWindowComponent} from '../modal-window.component';

@Directive({
  selector: '[appModalable]'
})
export class ModalableDirective {
  @Input() modalWindowRef: ModalWindowComponent | undefined;

  constructor() { }
}
