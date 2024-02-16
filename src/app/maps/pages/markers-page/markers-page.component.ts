import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map, LngLat, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color: string;
  marker: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: number[];
}

const getRandomPastelColor = () => {
  const r = (Math.random() * 127 + 128) | 0;
  const g = (Math.random() * 127 + 128) | 0;
  const b = (Math.random() * 127 + 128) | 0;

  return '#' + rgbToHex(r, g, b);
};

const rgbToHex = (r: number, g: number, b: number) =>
  ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

@Component({
  selector: 'marker-page',
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css',
})
export class MarkersPageComponent {
  @ViewChild('map') divMap?: ElementRef;

  public markers: MarkerAndColor[] = [];
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
      zoom: 13, // starting zoom
    });

    this.readFromLocalStorage();

    /*Otra forma de hacerlo

    const markerHtml = document.createElement('div');
    markerHtml.innerHTML = 'Javier Granados';

    const marker = new Marker({ element: markerHtml })
      .setLngLat(this.currentCenter)
      .addTo(this.map);*/
  }

  createMarker() {
    if (!this.map) return;

    const color = getRandomPastelColor();
    const lngLat = this.map.getCenter();

    this.addMarker(lngLat, color);
  }

  addMarker(lngLat: LngLat, color: string) {
    if (!this.map) return;

    const marker = new Marker({ color: color, draggable: true })
      .setLngLat(lngLat)
      .addTo(this.map);

    this.markers.push({
      color: color,
      marker: marker,
    });
    this.saveToLocalStorage();

    marker.on('dragend', () => this.saveToLocalStorage());
  }

  deleteMarker(index: number) {
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);
  }

  flyTo(marker: Marker) {
    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat(),
    });
  }

  saveToLocalStorage() {
    const plainMarkers: PlainMarker[] = this.markers.map(
      ({ color, marker }) => {
        return {
          color: color,
          lngLat: marker.getLngLat().toArray(),
        };
      }
    );

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers));
  }

  readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';

    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString);

    plainMarkers.forEach(({ color, lngLat }) => {
      const [lng, lat] = lngLat;
      const coords = new LngLat(lng, lat);
      this.addMarker(coords, color);
    });
  }
}
