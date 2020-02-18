import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'NumberToIterablePipe'
})
export class NumberToIterablePipe implements PipeTransform {
  transform(value, args?: number[]): any {
    return Array(value).fill(1).map((x, i) => x + i);
  }
}
