import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { DeviceSessionCardComponent } from './component/device-connection-card/device-session-card.component';
import { HeaderComponent } from './component/header/header.component';
import {ModalWindowModuleModule} from "./modules/modal-window-module/modal-window-module.module";

@NgModule({
  declarations: [
    AppComponent,
    DeviceSessionCardComponent,
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
