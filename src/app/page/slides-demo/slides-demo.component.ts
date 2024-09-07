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
    { label: 'Range 1', value: 25, locked: false },
    { label: 'Range 2', value: 25, locked: false },
    { label: 'Range 3', value: 25, locked: false },
    { label: 'Range 4', value: 25, locked: false },
  ];

  previousValues: number[] = this.ranges.map(range => range.value);

  get total(): number {
    return this.ranges.reduce((acc, range) => acc + range.value, 0);
  }

  onKnobMoveStart(index: number) {
    // Save the current values before any change
    this.previousValues = this.ranges.map(range => range.value);
  }

  onKnobMoveEnd(event: any, index: number) {
    const total = this.total;
    const diff = 100 - total;

    if (diff !== 0) {
      const success = this.adjustOtherRanges(index, diff);
      if (!success) {
        // If adjustment fails, reset to previous values
        this.resetToPreviousValues();
      }
    }
  }

  adjustOtherRanges(changedIndex: number, diff: number): boolean {
    const unlockedRanges = this.ranges.filter((range, i) => i !== changedIndex && !range.locked);
    const totalUnlockedValues = unlockedRanges.reduce((acc, range) => acc + range.value, 0);

    if (totalUnlockedValues === 0) {
      // If all other ranges are locked and total is not 100, we need to adjust the changed range back
      return false;
    }

    unlockedRanges.forEach(range => {
      const adjustment = (range.value / totalUnlockedValues) * diff;
      range.value = Math.min(100, Math.max(0, range.value + adjustment));
    });

    // Ensure the total is exactly 100 due to possible floating-point precision issues
    const newTotal = this.total;
    if (newTotal !== 100) {
      const correction = 100 - newTotal;
      this.ranges[changedIndex].value = Math.min(100, Math.max(0, this.ranges[changedIndex].value + correction));
    }

    return true;
  }

  resetToPreviousValues() {
    this.ranges.forEach((range, i) => {
      range.value = this.previousValues[i];
    });
  }
}
