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
  private store = inject(Store);
  private modalController = inject(ModalController);

  protected ranges: any[] = [];

  ngOnInit() {
    this.store.select(selectValueByKey(DYNAMIC_FILTER_RESULT_KEY)).subscribe((value) => {
      // if not empty, set the value to the range component
      if (isNotNil(value)) {
        console.log("set the existing value to the range component", value);
        // Clone the objects to ensure they are not frozen and properties are writable
        this.ranges = value.map((range: any) => ({ ...range }));
      }
    });
  }

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
