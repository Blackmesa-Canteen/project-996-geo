import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})

export class HomeComponent implements OnInit {
  map!: L.Map;

  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.initializeMap();
    this.loadGeoJSON();
  }

  initializeMap() {
    this.map = L.map('map', {
      center: [-37, 145],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  loadGeoJSON() {
    this.http.get('assets/test.geojson').subscribe((data: any) => {
      const geojsonLayer = L.geoJSON(data, {
        onEachFeature: (feature, layer) => {
          layer.on('click', () => {
            this.handleFeatureClick(feature);
          });
        },
      }).addTo(this.map);
    });
  }

  handleFeatureClick(feature: any) {
    console.log("formattedData:", feature.properties)
  }
}
