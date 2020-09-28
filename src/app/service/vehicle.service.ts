import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {httpOptions, RestService} from "./rest.service";
import {Vehicle} from "../model/vehicle";
import {catchError, tap} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";

const vehicleUrl = "http://localhost:8080/veh";

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends RestService {

  public static VEHICLE_ON = 'Allumé';
  public static VEHICLE_OFF = 'Eteint';
  public static VEHICLE_CRASH = 'Accident';
  public static VEHICLE_INACTIVE = 'Inactif';

  private vehicles = new BehaviorSubject<Vehicle[]>([]);
  currentVehicles = this.vehicles.asObservable();

  private vehicle = new BehaviorSubject<Vehicle>(null);
  currentVehicle = this.vehicle.asObservable();

  constructor(private http: HttpClient) {
    super();
    this.refreshVehicles();
  }

  refreshVehicles() {
    const url = `${vehicleUrl}/refresh`;
    this.http.get<Vehicle[]>(url)
      .pipe(
        tap(_ => console.log(`refreshed vehicles`)),
        catchError(this.handleError('refreshVehicles', [])))
      .subscribe(result => this.vehicles.next(result));
  }

  deleteVehicle(plateNumber: string) {
    const url = `${vehicleUrl}/${plateNumber}/del/`
    this.http.delete(url, httpOptions).pipe(
      tap(_ => console.log(`deleted vehicle and device for plate number : ${plateNumber}`)),
      catchError(this.handleError('deleteVehicle', null)))
      .subscribe()
  }

  getVehicles() {
    const url = `${vehicleUrl}/all`;
    return this.http.get<Vehicle[]>(url)
      .pipe(
        tap(_ => console.log(`fetched vehicles`)),
        catchError(this.handleError('getVehicles', []))
      )
      .subscribe(result => this.vehicles.next(result));
  }

  getVehicle(plateNumber: string) {
    const url = `${vehicleUrl}/${plateNumber}`;
    return this.http.get<Vehicle>(url)
      .pipe(
        tap(_ => console.log(`fetched vehicle`)),
        catchError(this.handleError('getVehicle', null))
      )
      .subscribe(result => this.vehicle.next(result));
  }

  addOrUpdateVehicle(vehicle : Vehicle){
    const url = `${vehicleUrl}/add/full`;
    return this.http.post<Vehicle>(url, vehicle)
      .pipe(
        tap((veh: Vehicle) => {
        console.log(`vehicle added of update with id = ${veh.id}`)
      }), catchError(this.handleError<Vehicle>('addOrUpdateVehicle', null)));
  }

}
