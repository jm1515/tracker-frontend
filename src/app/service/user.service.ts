import { Injectable } from '@angular/core';
import {httpOptions, RestService} from "./rest.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../model/user";
import {catchError, map, tap} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";

const userUrl = "http://localhost:8080/login";

@Injectable({
  providedIn: 'root'
})
export class UserService extends RestService {

  private user = new BehaviorSubject(null);
  currentUser = this.user.asObservable();

  constructor(private http: HttpClient) {
    super();
    this.getUserInfo();
  }

  getUserInfo(){
    const url = `${userUrl}/` + Number(sessionStorage.getItem('id'));
    return this.http.get<User>(url, httpOptions).pipe(
      tap(_ => console.log('get user informations')),
      catchError(this.handleError('getUserInfo', []))
    ).subscribe(result => this.user.next(result));
  }

  updateUserInfo(user: User){
    const url = `${userUrl}/edit`;
    return this.http.put(url, user).pipe(
      tap(_ => console.log(`update user`)),
      catchError(this.handleError('updateUserInfo', []))
    );
  }
}
