import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalWindowComponent} from "./modal-window.component";
import {ModalableDirective} from "./model/modalable.directive";


@NgModule({
  declarations: [
    ModalWindowComponent,
    ModalableDirective
  ],
  exports: [
    ModalWindowComponent,
    ModalableDirective
  ],
  imports: [
    CommonModule
  ]
})
export class ModalWindowModuleModule { }
