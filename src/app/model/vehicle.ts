import {User} from "./user";
import {Device} from "./device";

export class Vehicle {

  id: number;
  plateNumber: string;
  location: number;
  fuelState: number;
  speed: number;
  carState: string;
  carMileage: number;
  longitude: number;
  latitude: number;
  turnedOn: boolean;
  user: User;
  device: Device;

}
