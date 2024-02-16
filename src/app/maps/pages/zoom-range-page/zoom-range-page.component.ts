import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  selector: 'zoom-range-page',
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css',
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map') divMap?: ElementRef;

  public zoom: number = 10;
  public map?: Map;
  public currentCenter: LngLat = new LngLat(-4.42034, 36.72016);
  public longitude: number = -4.42034;
  public latitude: number = 36.72016;

  ngAfterViewInit(): void {
    if (!this.divMap) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      accessToken:
        'pk.eyJ1IjoiamF2aWdtOTQiLCJhIjoiY2xzb2Q3M3R5MGRoZTJqbzQ2dGE0NHByeCJ9.rm5rp7J3Up10ynct0GF71g',
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentCenter, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });

    this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  mapListeners() {
    if (!this.map) throw 'Mapa no inicializado';

    this.map.on('zoom', (e) => {
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend', (e) => {
      if (this.map!.getZoom() < 18) return;
      this.map!.zoomTo(18);
    });

    this.map.on('moveend', () => {
      this.currentCenter = this.map!.getCenter();
      const { lng, lat } = this.currentCenter;
      this.longitude = lng;
      this.latitude = lat;
    });
  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomOut() {
    this.map?.zoomOut();
  }

  zoomChanged(value: string) {
    this.zoom = Number(value);
    this.map?.zoomTo(this.zoom);
  }
}
