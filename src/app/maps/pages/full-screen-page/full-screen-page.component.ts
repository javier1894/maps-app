import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Map } from 'mapbox-gl';

@Component({
  selector: 'full-screen-page',
  templateUrl: './full-screen-page.component.html',
  styleUrl: './full-screen-page.component.css',
})
export class FullScreenPageComponent implements AfterViewInit {
  @ViewChild('map') divMap?: ElementRef;

  ngAfterViewInit(): void {
    if (!this.divMap) throw 'El elemento HTML no fue encontrado';

    const map = new Map({
      accessToken:
        'pk.eyJ1IjoiamF2aWdtOTQiLCJhIjoiY2xzb2Q3M3R5MGRoZTJqbzQ2dGE0NHByeCJ9.rm5rp7J3Up10ynct0GF71g',
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-4.42034, 36.72016], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
  }
}
