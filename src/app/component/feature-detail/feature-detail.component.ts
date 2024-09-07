import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {IonicModule, ModalController, NavController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {selectValueByKey} from "../../data-access/store/key-value/key-value.selectors";
import {FEATURE_DETAILS_KEY} from "../../data-access/constant/key-value-storeage.constants";
import {filter, Observable} from "rxjs";
import {isNotNil} from "rambda";
import {IFeatureDetailsData} from "../../data-access/model/feature-data";
import {setKeyValue} from "../../data-access/store/key-value/key-value.actions";

@Component({
  selector: 'app-feature-detail',
  templateUrl: './feature-detail.component.html',
  styleUrls: ['./feature-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class FeatureDetailComponent implements OnInit {

  private store = inject(Store);
  private readonly navController = inject(NavController);
  private readonly modalController = inject(ModalController);

  protected featureDetail$: Observable<IFeatureDetailsData> = this.store.select(selectValueByKey(FEATURE_DETAILS_KEY)).pipe(
    filter(isNotNil)
  );

  ngOnInit() {
    // init test data
    this.store.dispatch(setKeyValue({key: FEATURE_DETAILS_KEY, value: {
        title: 'test',
        description: 'test des',
    }}));
  }

  handleExit = async () => {
    await this.modalController.dismiss();
  }
}
