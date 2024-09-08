import {Component, inject, OnInit} from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import * as L from 'leaflet';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, LeafletModule, FormsModule]
})

export class HomeComponent implements OnInit {
  protected map!: L.Map;

  private store = inject(Store);
  private http = inject(HttpClient);
  private modalController = inject(ModalController);

  protected ranges: any[] = [];

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
          { label: 'Range 1', value: 25, locked: false, ignore: false },
          { label: 'Range 2', value: 25, locked: false, ignore: false },
          { label: 'Range 3', value: 25, locked: false, ignore: false },
          { label: 'Range 4', value: 25, locked: false, ignore: false },
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
  onDynamicFilterSideMenuCheckboxChange(event: any, range: any) {
    console.log('Checkbox checked:', event.detail.checked);
    console.log('Label:', range.label);
  }

  private initSideMenuLayerLabels() {
    this.store.select(selectValueByKey(DYNAMIC_FILTER_RESULT_KEY)).subscribe((value) => {
      if (isNotNil(value)) {
        this.ranges = value
          .filter((range: any) => !range.ignore)
          .sort((a: any, b: any) => b.value - a.value)
          .map((range: any) => ({...range}));
      }
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
