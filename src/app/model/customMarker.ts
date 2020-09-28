import LatLng = google.maps.LatLng;
import Map = google.maps.Map;

export class CustomMarker {

  position: LatLng;
  map: Map;
  title: string;
  icon: string;
  visible: boolean;
  state: string;
  speed: number;
}

