import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { GeneralModule } from './general.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from './interceptors/token.interceptor';
import {FileValidator} from './validators/file-input.validator'

@NgModule({
  declarations: [
    AppComponent,
    FileValidator
  ],
  imports: [
    BrowserModule,
    GeneralModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
