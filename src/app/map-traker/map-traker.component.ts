import {Component, Inject, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import MarkerClusterer from '@google/markerclustererplus';
import {Observable, Subject} from "rxjs";
import {Vehicle} from "../model/vehicle";
import {VehicleService} from "../service/vehicle.service";
import {startWith, takeUntil, map} from "rxjs/operators";
import {CustomMarker} from "../model/customMarker";
import {DOCUMENT} from "@angular/common";
import {FormControl} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import { mapTrakerAnimations } from './map-traker.animations';

@Component({
  selector: 'app-map-traker',
  templateUrl: './map-traker.component.html',
  styleUrls: ['./map-traker.component.scss'],
  animations: mapTrakerAnimations
})
export class MapTrakerComponent implements AfterViewInit, OnInit, OnDestroy {

  onDestroy = new Subject<void>();
  vehicles: Vehicle[];
  markers: CustomMarker[];
  displayedColumns: string[] = ['select', 'title', 'speed', 'picture', 'button'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;
  @ViewChild('listCars', {static: false}) listCars: ElementRef;
  @ViewChild('streetView', {static: false}) streetView: ElementRef;
  //@ViewChild('searchMarker', {static: false}) searchMarker: ElementRef;
  @ViewChild('fabButton', {static: false}) fabButton: ElementRef;

  //myControl = new FormControl();
  options: string[] = [];
  //filteredOptions: Observable<string[]>;

  map: google.maps.Map;
  geocoder: google.maps.Geocoder;
  markerCluster: MarkerClusterer;

  lat = 48.8534;
  lng = 2.3488;

  coordinates = new google.maps.LatLng(this.lat, this.lng);

  constructor(private renderer: Renderer2, private router: Router,
              private authentication: AuthenticationService, private vehicleService: VehicleService,
              @Inject(DOCUMENT) private document) {
  }

  /*private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }*/

  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 4,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: true
  };

  urlIcon: string = "../assets/img/";

  @ViewChild('legend') legend: ElementRef;
  icons = [
    {
      name: VehicleService.VEHICLE_ON,
      icon: this.urlIcon + 'green-arrow.png'
    },
    {
      name: VehicleService.VEHICLE_OFF,
      icon: this.urlIcon + 'yellow-arrow.png'
    },
    {
      name: VehicleService.VEHICLE_CRASH,
      icon: this.urlIcon + 'red-arrow.png'
    },
    {
      name: VehicleService.VEHICLE_INACTIVE,
      icon: this.urlIcon + 'blue-arrow.png'
    },
  ];

  ngOnInit(): void {
    this.vehicles = [];
    this.markers = [];
    this.vehicleService.currentVehicles.pipe(takeUntil(this.onDestroy))
      .subscribe(values => {
        this.vehicles = values;
        if (this.vehicles.length > 0) {
          for (let index = 0; index < this.vehicles.length; index++) {
            const vehicle = this.vehicles[index];
            const position = new google.maps.LatLng(vehicle.latitude, vehicle.longitude);
            const map = this.map;
            const title = vehicle.plateNumber;
            const state = vehicle.carState;
            const fuel = vehicle.fuelState;
            const mileAge = vehicle.carMileage;
            let icon: string;
            switch (state) {
              case VehicleService.VEHICLE_ON : {
                icon = this.urlIcon + 'green-arrow.png';
                break;
              }
              case VehicleService.VEHICLE_OFF : {
                icon = this.urlIcon + 'yellow-arrow.png';
                break;
              }
              case VehicleService.VEHICLE_CRASH : {
                icon = this.urlIcon + 'red-arrow.png';
                break;
              }
              case VehicleService.VEHICLE_INACTIVE : {
                icon = this.urlIcon + 'blue-arrow.png';
                break;
              }
              default : {
                icon = this.urlIcon + 'pink-dot.png';
              }
            }
            const visible = true;
            const speed = vehicle.speed;
            let customMarker = {
              position,
              map,
              title,
              icon,
              visible,
              state,
              speed,
              fuel,
              mileAge
            } as CustomMarker;
            this.markers.push(customMarker);
            this.options.push(customMarker.title);
          }
          this.dataSource.data = this.markers;
          this.dataSource.paginator = this.paginator;
          this.geocoder = new google.maps.Geocoder();
          this.loadAllMarkers();
          this.markerCluster = new MarkerClusterer(this.map, this.markersArray,
            {
              imagePath :'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            });
          this.markerCluster.setMinimumClusterSize(2);
        }
      });
    /*this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );*/
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: CustomMarker): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.title + 1}`;
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  ngAfterViewInit() {
    this.mapInitializer();
    this.updatePosition();
  }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement,
      this.mapOptions);
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.legend.nativeElement);
    this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(this.listCars.nativeElement);
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.streetView.nativeElement);
    this.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(this.fabButton.nativeElement);
  }

  markersArray = [];

  loadAllMarkers() {
    this.markers.forEach(markerInfo => {
      //Creating a new marker object
      const marker = new google.maps.Marker({
        ...markerInfo
      });
      //creating a new info window with markers info
      const infoWindow = new google.maps.InfoWindow();
      this.contentMarkerWindow(marker, infoWindow);
      //Add click event to open info window on marker
      marker.addListener("click", () => {
        infoWindow.open(marker.getMap(), marker);
        this.setStreetView(infoWindow, marker);
      });

      google.maps.event.addListener(infoWindow, 'domready', () => {
        let button = document.getElementById('test');
        button.addEventListener('click', () => {
          this.router.navigate(['/vehicle/' + marker.getTitle()]);
        });
      });

      //const controls = this.map.controls;
      infoWindow.addListener('closeclick',function(){
        //controls[google.maps.ControlPosition.TOP_RIGHT].clear();
        document.getElementById('street-view').innerHTML = '';
        document.getElementById('street-view').style.backgroundColor = 'white';
      });
      //Adding marker to google map
      marker.setMap(this.map);
      this.markersArray.push(marker);
    });
  }

  clickCheckbox(event: any) {
    for (let i = 0; i < this.markersArray.length; i++) {
      if ((this.markersArray[i].state === event.source.value && event.checked === false)
        || (this.markersArray[i].title === event.source.value && event.checked === false)) {
        this.markersArray[i].setVisible(false);
      } else if ((this.markersArray[i].state === event.source.value && event.checked === true)
        || (this.markersArray[i].title === event.source.value && event.checked === true)) {
        this.markersArray[i].setVisible(true);
      }
      this.markerCluster.setIgnoreHidden(true);
      this.markerCluster.repaint();
    }
  }

  contentMarkerWindow(marker: any, infoWindow: any){
    let content = "<div style='font-size:14px'> ";
    content += "<h3> " + marker.getTitle() + "</h3>";
    let latLng = {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()};
    content += "<b><label> Vitesse : </label></b> " + "<span>" + marker.speed + " km/h</span><br>";
    content += "<b><label> Etat : </label></b> " + "<span>" + marker.state + "</span><br>";
    content += "<b><label> Quantité d'essence restante : </label></b> " + "<span>" + marker.fuel + " %</span><br>";
    content += "<b><label> Distance Parcourue : </label></b> " + "<span>" + marker.mileAge + " km</span><br>";
    this.geocoder.geocode({'location': latLng}, function(results, status) {
      content += "<b><label> Ville : </label></b> " + "<span>" + results[0].formatted_address + "</span><br>";
      content += "<button id='test' style='float: right;'> Modifier </button>";
      content +=  "</div>";
      infoWindow.setContent(content);
    });
  }

  setStreetView(infoWindow: any, marker: any){
    let panorama = null;
    google.maps.event.addListener(infoWindow, "domready", function() {
      panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
        enableCloseButton: false,
        addressControl: false,
        linksControl: false,
        visible: true
      });
      panorama.setPosition(marker.getPosition());
    });
  }

  getMarker(markerName: string){
    for (let i = 0; i < this.markersArray.length; i++) {
      if ((this.markersArray[i].title === markerName) && (this.markersArray[i].visible === true)) {
        this.map.setZoom(14);
        this.map.setCenter(this.markersArray[i].getPosition());
      }
    }
  }

  fabButtons = [
    {
      icon: 'streetview'
    },
    {
      icon: 'table_view'
    },
    {
      icon: 'not_listed_location'
    }
  ];
  buttons = [];
  fabTogglerState = 'inactive';

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }

  actionsButton(value: string){
    switch (value) {
      case 'streetview': {
        this.showElement(google.maps.ControlPosition.TOP_RIGHT, this.streetView);
        break;
      }
      case 'table_view': {
        this.showElement(google.maps.ControlPosition.LEFT_TOP, this.listCars);
        break;
      }
      case 'not_listed_location': {
        this.showElement(google.maps.ControlPosition.RIGHT_BOTTOM, this.legend);
        break;
      }
    }
  }

  showElement(position: any, element: ElementRef){
    if(this.map.controls[position].getLength() === 0){
      this.map.controls[position].push(element.nativeElement);
    }
    else if(this.map.controls[position].getLength() === 1){
      this.map.controls[position].clear();
    }
  }

  updatePosition() {
    let pathCoordinates = Array();
    setInterval(() => {
      for (let i = 0; i < this.markersArray.length; i++) {
        if (this.markersArray[i].state === 'Allumé') {
          this.markersArray[i].setPosition(new google.maps.LatLng(this.markersArray[i].getPosition().lat() + 0.0005,
            this.markersArray[i].getPosition().lng() + 0.0005));
        }
        /*pathCoordinates.push({
          lat: this.markersArray[i].getPosition().lat(),
          lng: this.markersArray[i].getPosition().lng()
        });
        new google.maps.Polyline({
          path : pathCoordinates,
          geodesic : true,
          strokeColor : this.markersArray[i].color,
          strokeOpacity : 1,
          strokeWeight : 4,
          map : this.map
        });*/
      }

    }, 5000);
  }

}
