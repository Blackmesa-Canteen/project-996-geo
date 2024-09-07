import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class HomeComponent implements OnInit {
  map!: L.Map;

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.map = L.map('map', {
      center: [-37, 145], // Set the map center coordinates
      zoom: 13, // Set the initial zoom level
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }
}
