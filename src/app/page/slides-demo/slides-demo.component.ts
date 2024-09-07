import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-slides-demo',
  templateUrl: './slides-demo.component.html',
  styleUrls: ['./slides-demo.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SlidesDemoComponent  implements OnInit {
  ngOnInit(): void {
  }

  ranges = [
    { label: 'Range 1', value: 25 },
    { label: 'Range 2', value: 25 },
    { label: 'Range 3', value: 25 },
    { label: 'Range 4', value: 25 },
  ];

  get total(): number {
    return this.ranges.reduce((acc, range) => acc + range.value, 0);
  }

  onKnobMoveEnd(event: any, index: number) {
    const total = this.total;
    const diff = 100 - total;

    if (diff !== 0) {
      this.adjustOtherRanges(index, diff);
    }
  }

  adjustOtherRanges(changedIndex: number, diff: number) {
    const otherRanges = this.ranges.filter((_, i) => i !== changedIndex);
    const totalOtherValues = otherRanges.reduce((acc, range) => acc + range.value, 0);

    otherRanges.forEach((range, i) => {
      const adjustment = (range.value / totalOtherValues) * diff;
      range.value += adjustment;
    });

    // Ensure the total is exactly 100 due to possible floating-point precision issues
    const newTotal = this.total;
    if (newTotal !== 100) {
      const correction = 100 - newTotal;
      this.ranges[changedIndex].value += correction;
    }
  }

}
