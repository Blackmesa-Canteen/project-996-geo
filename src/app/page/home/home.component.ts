import {Component, inject, OnInit} from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import * as L from 'leaflet';
import {HttpClient} from '@angular/common/http';
import {FeatureDetailComponent} from "../../component/feature-detail/feature-detail.component";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {CategoryFilterComponent} from "../category-filter/category-filter.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, LeafletModule]
})

export class HomeComponent implements OnInit {
  map!: L.Map;

  constructor(private http: HttpClient) {
  }

  private modalController = inject(ModalController);

  protected mapOptions = {
    zoom: 11,
    center: L.latLng({lat: -37, lng: 145})
  } as L.MapOptions;

  onMapReady(map: L.Map) {
    this.map = map;
    this.initializeMap();
    this.loadGeoJSON();
    this.invalidateSize();
  }

  ngOnInit() {
    this.presentDynamicFilterModal();
  }

  initializeMap() {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  loadGeoJSON() {
    this.http.get('assets/test.geojson').subscribe((data: any) => {
      L.geoJSON(data, {
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
    const modal = this.modalController.create({
        component: FeatureDetailComponent,
        componentProps: {
          featureDetail: feature.properties,
        },
      }
    )

    modal.then((m) => m.present());
  }

  protected presentDynamicFilterModal() {
    this.modalController.create({
      component: CategoryFilterComponent,
    }).then((m) => m.present());
  }

  private invalidateSize = () => {
    setTimeout(() => this.map.invalidateSize(true), 0);
  };
}
