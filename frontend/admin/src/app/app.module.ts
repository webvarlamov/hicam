import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { VideoElementWrapper } from './component/video-element-wrapper/video-element-wrapper.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { ConnectionsWrapperComponent } from './component/connections-wrapper/connections-wrapper.component';
import { DeviceConnectionLinkModalComponent } from './component/device-connection-link-modal/device-connection-link-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoElementWrapper,
    HeaderComponent,
    FooterComponent,
    ConnectionsWrapperComponent,
    DeviceConnectionLinkModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
