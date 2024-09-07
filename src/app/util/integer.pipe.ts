import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'integer',
  standalone: true
})
export class IntegerPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return Math.round(value);
  }

}
