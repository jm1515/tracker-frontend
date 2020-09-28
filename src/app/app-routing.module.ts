import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ForgetPasswordComponent} from "./forget-password/forget-password.component";
import {MapTrakerComponent} from "./map-traker/map-traker.component";
import {VehicleTrakerComponent} from "./vehicle-traker/vehicle-traker.component";
import {HomeTrakerComponent} from "./home-traker/home-traker.component";
import {ProfileComponent} from "./profile/profile.component";
import {UpdatePwdComponent} from "./update-pwd/update-pwd.component";

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'forgetPwd', component: ForgetPasswordComponent},
  { path: 'map', component: MapTrakerComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'homeTraker', component: HomeTrakerComponent},
  { path: 'vehicle/:plateNumber', component: VehicleTrakerComponent},
  { path: 'updatePwd', component: UpdatePwdComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
