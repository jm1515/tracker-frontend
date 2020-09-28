import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogDeleteComponent} from "../dialog-delete/dialog-delete.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {VehicleService} from "../service/vehicle.service";
import {take, takeUntil} from "rxjs/operators";
import {Vehicle} from "../model/vehicle";
import {Device} from "../model/device";
import {User} from "../model/user";

@Component({
  selector: 'app-vehicle-traker',
  templateUrl: './vehicle-traker.component.html',
  styleUrls: ['./vehicle-traker.component.css']
})
export class VehicleTrakerComponent implements OnInit, OnDestroy {

  onDestroy = new Subject<void>();
  vehicle: Vehicle;

  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute, private vehicleService: VehicleService) {
  }

  ngOnInit(): void {
    const plateNumber = this.route.snapshot.paramMap.get('plateNumber');
    if (plateNumber != 'new') {
      this.vehicleService.getVehicle(plateNumber);
      this.vehicleService.currentVehicle.pipe(takeUntil(this.onDestroy))
        .subscribe(currentVehicle => this.vehicle = currentVehicle);
    } else {
      this.vehicle = null;
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      plateNumber: this.vehicle.plateNumber,
      goBackToHome: true
    };
    this.dialog.open(DialogDeleteComponent, dialogConfig);
  }

  updateOrAddVehcile(carMileage: number, carState: string, fuelState: number, plateNumber: string, longitude: number,
                     latitude: number, deviceID: string, deviceName: string, firstname : string, lastname : string,
                     email : string, phoneNumber : string) {
    if (plateNumber == ''){
      return;
    }
    if (this.vehicle != null) {
      this.vehicle.carMileage = carMileage;
      this.vehicle.carState = carState;
      this.vehicle.fuelState = fuelState;
      this.vehicle.plateNumber = plateNumber;
      this.vehicle.longitude = longitude;
      this.vehicle.latitude = latitude;

      const device = this.vehicle.device;

      device.deviceID = deviceID;
      device.deviceName = deviceName;

      const user = this.vehicle.user

      user.firstname = firstname;
      user.lastname = lastname;
      user.email = email;
      user.phoneNumber = phoneNumber;

      this.vehicleService.addOrUpdateVehicle(this.vehicle).pipe(takeUntil(this.onDestroy)).subscribe(_ => {
        this.goMap()
      });
    } else {
      const dev = {deviceID, deviceName} as Device;
      const use = {firstname, lastname, email, phoneNumber} as User;
      const veh = {carMileage, carState, fuelState, plateNumber, longitude, latitude} as Vehicle;
      veh.device = dev;
      veh.user = use;
      this.vehicleService.addOrUpdateVehicle(veh).pipe(takeUntil(this.onDestroy)).subscribe(_ => {
        this.goMap()
      });
    }
  }

  goMap() {
    this.router.navigate(['/map']).then(() => {
      window.location.reload();
    });
  }

  goBack(){
    this.router.navigate(['/homeTraker']);
  }


}
