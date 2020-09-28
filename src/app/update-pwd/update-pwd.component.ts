import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {User} from "../model/user";
import {Router} from "@angular/router";
import {UserService} from "../service/user.service";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-update-pwd',
  templateUrl: './update-pwd.component.html',
  styleUrls: ['./update-pwd.component.css']
})
export class UpdatePwdComponent implements OnInit, OnDestroy {

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

  updatePassword(password: string){
    this.user.password = password;
    this.userService.updateUserInfo(this.user).subscribe(() => {
      this.router.navigate(['/map']).then(() => {
        window.location.reload();
      });
    });
  }

}
