import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from "rxjs/operators";
import {User} from "../model/user";
import {httpOptions, RestService} from "./rest.service";

const authUrl = "http://localhost:8080/login";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends RestService {

  constructor(private http: HttpClient) {
    super();
  }

  logIn(email: string, password: string) {
    return this.http.post<User>(authUrl, {email, password}, httpOptions)
      .pipe(map(user => {
          console.log(`logged in as : ${email}`);
          sessionStorage.setItem('email', user.email);
          sessionStorage.setItem('id', String(user.id));
        }), catchError(this.handleError('authentication', null))
      );
  }

  isUserLoggedIn() {
    return !(sessionStorage.getItem('email') === null);
  }

  logOut() {
    sessionStorage.clear();
  }

}
