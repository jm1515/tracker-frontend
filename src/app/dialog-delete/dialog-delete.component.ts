import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VehicleService} from "../service/vehicle.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent implements OnInit {

  plateNumber: string;
  goBackToHome: boolean;

  constructor(private vehcileService: VehicleService, private dialogRef: MatDialogRef<DialogDeleteComponent>, private router: Router,
              @Inject(MAT_DIALOG_DATA) data) {
    this.plateNumber = data.plateNumber;
    this.goBackToHome = data.goBackToHome;
  }

  ngOnInit(): void {
  }

  onDeleteClick() {
   this.vehcileService.deleteVehicle(this.plateNumber);
    if (this.goBackToHome) {
      this.router.navigate(['/map']).then(() => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  }

}
