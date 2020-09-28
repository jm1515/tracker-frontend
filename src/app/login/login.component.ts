import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  onDestroy = new Subject<void>();

  constructor(private router: Router, private authentication: AuthenticationService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  login(email: string, password: string) {
   this.authentication.logIn(email, password)
     .subscribe(() => {
       if (sessionStorage.getItem("email") != null){
         this.router.navigate(['/map']);
       }
       else {
         alert('Connexion refusée');
         console.log('login failure');
       }
     })
  }


}
