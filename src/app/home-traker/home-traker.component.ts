import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogDeleteComponent} from "../dialog-delete/dialog-delete.component";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {VehicleService} from "../service/vehicle.service";
import {Vehicle} from "../model/vehicle";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-home-traker',
  templateUrl: './home-traker.component.html',
  styleUrls: ['./home-traker.component.css']
})
export class HomeTrakerComponent implements OnInit, OnDestroy {

  onDestroy = new Subject<void>();
  vehicles: Vehicle[];

  constructor(public dialog: MatDialog, private router: Router, private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.vehicles = [];
    this.vehicleService.currentVehicles.pipe(takeUntil(this.onDestroy))
      .subscribe(values => {
        this.vehicles = values;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  openDialog(plateNumber : string){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      plateNumber : plateNumber,
      goBackToHome : false
    };
    this.dialog.open(DialogDeleteComponent, dialogConfig);
  }

  showVehicle(plateNumber : string){
    this.router.navigate(['/vehicle/' + plateNumber]);
  }

}
