import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {AppRangeExample} from "../../component/slides-demo/app-range-example";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {setKeyValue} from "../../data-access/store/key-value/key-value.actions";
import {DYNAMIC_FILTER_RESULT_KEY} from "../../data-access/constant/key-value-storeage.constants";
import {selectValueByKey} from "../../data-access/store/key-value/key-value.selectors";
import {isNotNil} from "rambda";

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, AppRangeExample]
})
export class CategoryFilterComponent  implements OnInit {

  @ViewChild(AppRangeExample) rangeComponent!: AppRangeExample;

  private router = inject(Router);
  private store = inject(Store);
  private modalController = inject(ModalController);

  constructor() { }

  ngOnInit() {
    this.store.select(selectValueByKey(DYNAMIC_FILTER_RESULT_KEY)).subscribe((value) => {
      // if not empty, set the value to the range component
      if (isNotNil(value)) {
        console.log("set the existing value to the range component", value);
        this.ranges = value;
      }
    });
  }

  ranges = [
    { label: 'Range 1', value: 25, locked: false, ignore: false },
    { label: 'Range 2', value: 25, locked: false, ignore: false },
    { label: 'Range 3', value: 25, locked: false, ignore: false },
    { label: 'Range 4', value: 25, locked: false, ignore: false },
  ];

  onRangesChange(newRanges: any[]) {
    this.ranges = newRanges;
  }

  onResetButtonClicked() {
    this.rangeComponent.resetRanges();
  }

  onApplyButtonClicked() {
    this.store.dispatch(
      setKeyValue({ key:DYNAMIC_FILTER_RESULT_KEY, value: this.ranges })
    )
    this.modalController.dismiss();
  }

  OnCancelButtonClicked() {
    this.modalController.dismiss();
  }
}
