import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './login/login.component';
import {MaterialModule} from "./material.module";
import {RegisterComponent} from './register/register.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {HttpClientModule} from "@angular/common/http";
import {MapTrakerComponent} from './map-traker/map-traker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './profile/profile.component';
import { MapToolbarComponent } from './map-toolbar/map-toolbar.component';
import { HomeTrakerComponent } from './home-traker/home-traker.component';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';
import { VehicleTrakerComponent } from './vehicle-traker/vehicle-traker.component';
import { UpdatePwdComponent } from './update-pwd/update-pwd.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    MapTrakerComponent,
    ProfileComponent,
    MapToolbarComponent,
    HomeTrakerComponent,
    DialogDeleteComponent,
    VehicleTrakerComponent,
    UpdatePwdComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
