import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'maps-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css',
})
export class MiniMapComponent implements AfterViewInit {
  @ViewChild('map') divMap?: ElementRef;
  @Input() lngLat?: [number, number];

  ngAfterViewInit(): void {
    if (!this.divMap?.nativeElement) throw 'Map did not found';
    if (!this.lngLat) throw "lngLat can't be null";

    const map = new Map({
      accessToken:
        'pk.eyJ1IjoiamF2aWdtOTQiLCJhIjoiY2xzb2Q3M3R5MGRoZTJqbzQ2dGE0NHByeCJ9.rm5rp7J3Up10ynct0GF71g',
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 15, // starting zoom
      interactive: false,
    });

    new Marker().setLngLat(this.lngLat).addTo(map);
  }
}
