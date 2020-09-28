import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../service/user.service";
import {User} from "../model/user";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  onDestroy = new Subject<void>();
  user: User;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    console.log('Id user ', sessionStorage.getItem('id'));
    this.userService.currentUser.pipe(takeUntil(this.onDestroy)).subscribe(user =>{
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  updateUser(firstname: string, lastname: string, email: string, phone: string){
    this.user.firstname = firstname;
    this.user.lastname = lastname;
    this.user.email = email;
    this.user.phoneNumber = phone;
    this.userService.updateUserInfo(this.user).subscribe(() => {
      this.router.navigate(['/map']).then(() => {
        window.location.reload();
      });
    });
  }



}
