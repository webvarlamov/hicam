import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { DeviceConnectionCardComponent } from './component/device-connection-card/device-connection-card.component';
import { HeaderComponent } from './component/header/header.component';
import {ModalWindowModuleModule} from "./modules/modal-window-module/modal-window-module.module";

@NgModule({
  declarations: [
    AppComponent,
    DeviceConnectionCardComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ModalWindowModuleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
