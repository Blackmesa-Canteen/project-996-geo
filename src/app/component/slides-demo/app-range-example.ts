import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IntegerPipe} from "../../util/integer.pipe";

@Component({
  selector: 'app-range-example',
  templateUrl: './app-range-example.html',
  styleUrls: ['./app-range-example.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IntegerPipe]
})
export class AppRangeExample implements OnInit {
  ngOnInit(): void {
  }

  @Input() ranges = [
    { label: 'Range 1', value: 25, locked: false, ignore: false },
    { label: 'Range 2', value: 25, locked: false, ignore: false },
    { label: 'Range 3', value: 25, locked: false, ignore: false },
    { label: 'Range 4', value: 25, locked: false, ignore: false },
  ];

  @Output() rangesChange = new EventEmitter<any[]>();

  previousValues: number[] = this.ranges.map(range => range.value);

  get total(): number {
    return this.ranges
      .filter(range => !range.ignore)
      .reduce((acc, range) => acc + range.value, 0);
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
    const unlockedAndNotIgnoredRanges = this.ranges.filter((range, i) => i !== changedIndex && !range.locked && !range.ignore);
    const totalUnlockedValues = unlockedAndNotIgnoredRanges.reduce((acc, range) => acc + range.value, 0);

    if (totalUnlockedValues === 0) {
      // If all other ranges are locked or ignored and total is not 100, we need to adjust the changed range back
      return false;
    }

    unlockedAndNotIgnoredRanges.forEach(range => {
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

  onIgnoreChange() {
    // Reset and redistribute values when any ignore checkbox is toggled
    this.resetAndRedistributeValues();
  }

  resetAndRedistributeValues() {
    const numOfActiveRanges = this.ranges.filter(range => !range.ignore).length;
    const newValue = numOfActiveRanges > 0 ? 100 / numOfActiveRanges : 0;

    this.ranges.forEach(range => {
      if (!range.ignore) {
        range.value = newValue;
      }
    });
  }

  // New reset method to be called from the parent component
  resetRanges() {
    this.resetAndRedistributeValues();
    this.rangesChange.emit(this.ranges);
  }
}
