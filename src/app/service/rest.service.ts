import {Injectable} from '@angular/core';
import {HttpHeaders, HttpResponse, HttpErrorResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";

export const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor() {
  }

  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`Error on operation ${operation} : ${error.message}`);
      return of(result as T)
    };
  }
}
