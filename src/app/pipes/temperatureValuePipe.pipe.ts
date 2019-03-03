import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'TemperatureValuePipe'
})
export class TemperatureValuePipe implements PipeTransform {
    transform(value, args: number[]): any {
        return value < 0 ? value : `+${value}`;
    }
}
