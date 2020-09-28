import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from "../model/user";
import {httpOptions, RestService} from "./rest.service";
import {catchError, tap} from "rxjs/operators";

const registerUrl = "http://localhost:8080/subs/add";

@Injectable({
  providedIn: 'root'
})
export class RegisterService extends RestService {

  constructor(private http: HttpClient) {
    super();
  }

  register(user: User) {
    return this.http.post<User>(registerUrl, user, httpOptions)
      .pipe(
        tap((user: User) => console.log(`user created : ${user.email}`)),
        catchError(this.handleError<User>('register', null))
      )
  }
}
