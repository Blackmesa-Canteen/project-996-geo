import {Component, inject, OnInit} from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import * as L from 'leaflet';
import 'leaflet.heat';
import {HttpClient} from '@angular/common/http';
import {FeatureDetailComponent} from "../../component/feature-detail/feature-detail.component";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {CategoryFilterComponent} from "../category-filter/category-filter.component";
import {Store} from "@ngrx/store";
import {setKeyValue} from "../../data-access/store/key-value/key-value.actions";
import {DYNAMIC_FILTER_RESULT_KEY} from "../../data-access/constant/key-value-storeage.constants";
import {selectValueByKey} from "../../data-access/store/key-value/key-value.selectors";
import {isNotNil} from "rambda";
import {FormsModule} from "@angular/forms";
import {HeatMapOptions} from "leaflet";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, LeafletModule, FormsModule]
})

export class HomeComponent implements OnInit {
  protected map!: L.Map;
  private heatLayer?: L.Layer;

  private store = inject(Store);
  private http = inject(HttpClient);
  private modalController = inject(ModalController);

  protected ranges: any[] = [];

  protected mapOptions = {
    zoom: 7,
    center: L.latLng({lat: -37, lng: 145})
  } as L.MapOptions;

  onMapReady(map: L.Map) {
    this.map = map;
    this.initializeMap();
    this.loadGeoJSON();
    this.invalidateSize();
  }

  ngOnInit() {
    this.initDynamicFilterData();
    this.presentDynamicFilterModal();
    this.initSideMenuLayerLabels();
  }

  /**
   * Initialize the dynamic filter data here
   * @private
   */
  private initDynamicFilterData() {
    this.store.dispatch(
      setKeyValue({key: DYNAMIC_FILTER_RESULT_KEY, value: [
          { label: 'Distance from the grid', value: 33, locked: false, ignore: false },
          { label: 'Solar radiation', value: 33, locked: false, ignore: false },
          { label: 'Land area', value: 34, locked: false, ignore: false },
        ]})
    )
  }

  /**
   * If the checkbox is checked in the side menu.
   *
   * We can use this to control the map layers
   * @param event
   * @param range
   */
  protected onDynamicRangesMenuCheckboxChange(event: any, range: any) {
    console.log('Checkbox checked:', event.detail.checked);
    console.log('Label:', range.label);
  }

  /**
   * Will listen to the dynamic filter data changes
   * @param value
   * @constructor
   * @private
   */
  private OnDynamicRangesChanged(value: any) {
    if (isNotNil(value)) {
      this.ranges = value
        .filter((range: any) => !range.ignore)
        .sort((a: any, b: any) => b.value - a.value)
        .map((range: any) => ({...range}));

      // TODO: render the heatmap data accordingly
      this.renderHeatmapData();
    }
  }

  /**
   * Use this to render the heatmap data on the map
   * Currently, it's just random data for now
   * @private
   */
  private renderHeatmapData() {
    const center = L.latLng({ lat: -37, lng: 145 });
    const points: L.HeatLatLngTuple[] = [];
    const numPoints = 1000; // Number of random points

    for (let i = 0; i < numPoints; i++) {
      const lat = center.lat + (Math.random() - 0.5) * 2; // Larger random latitude range
      const lng = center.lng + (Math.random() - 0.5) * 2; // Larger random longitude range
      const intensity = Math.random(); // Random intensity value
      points.push([lat, lng, intensity]);
    }

    const heatMapOptions: L.HeatMapOptions = {
      radius: 60, // Increased radius
      blur: 40,   // Increased blur
      maxZoom: 17,
      max: 1.0,   // Maximum intensity value
      gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' } // Custom gradient
    };

    if (this.map) {
      // Remove existing heatmap layer if it exists
      if (this.heatLayer) {
        this.map.removeLayer(this.heatLayer);
      }

      // Add the new heatmap layer to the map
      this.heatLayer = L.heatLayer(points, heatMapOptions).addTo(this.map);
    }
  }



  private initSideMenuLayerLabels() {
    this.store.select(selectValueByKey(DYNAMIC_FILTER_RESULT_KEY)).subscribe((value) => {
      this.OnDynamicRangesChanged(value);
    });
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
