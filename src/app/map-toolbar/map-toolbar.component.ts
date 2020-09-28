import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";

@Component({
  selector: 'app-map-toolbar',
  templateUrl: './map-toolbar.component.html',
  styleUrls: ['./map-toolbar.component.css']
})
export class MapToolbarComponent implements OnInit {

  constructor(private router: Router, private authentication: AuthenticationService) { }

  ngOnInit(): void {
  }

  logOut() {
    this.authentication.logOut();
    setTimeout(() => {
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    }, 1000);
  }

  profile(){
    this.router.navigate(['/profile']);
  }

  home(){
    this.router.navigate(['/homeTraker']);
  }

  map(){
    this.router.navigate(['/map']).then(() => {
      window.location.reload();
    });
  }

  addVehicle(){
    this.router.navigate(['/vehicle/new']).then(() => {
      window.location.reload();
    });
  }

}
