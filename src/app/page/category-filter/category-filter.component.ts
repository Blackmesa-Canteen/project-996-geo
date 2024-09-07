import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {AppRangeExample} from "../../component/slides-demo/app-range-example";

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, AppRangeExample]
})
export class CategoryFilterComponent  implements OnInit {

  @ViewChild(AppRangeExample) rangeComponent!: AppRangeExample;

  constructor() { }

  ngOnInit() {}

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
    console.log('Ranges:', this.ranges);
  }
}
