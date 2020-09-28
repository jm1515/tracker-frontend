import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {RegisterService} from "../service/register.service";
import {User} from "../model/user";
import {takeUntil} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  onDestroy = new Subject<void>();

  constructor(private router: Router, private registerService: RegisterService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  register(firstname: string, lastname: string, email: string, phoneNumber: string, password: string, passwordConfirm: string) {
    if (password != passwordConfirm) {
      alert("Les mots de passes de correspondent pas");
      return;
    }

    this.registerService.register({firstname, lastname, email, phoneNumber, password} as User)
      .pipe(takeUntil(this.onDestroy)).subscribe(user => {
      sessionStorage.setItem("email", user.email);
      this.router.navigate(['/map']);
    })
  }


}
