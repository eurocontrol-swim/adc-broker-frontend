import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as data from './label-dict.json';

@Pipe({
  name: 'adcLabel',
})
@Injectable({
  providedIn: 'root',
})
export class AdcLabelPipe implements PipeTransform {
  transform(value: string): string {
    var result = (data as any)['default'];
    if (result.hasOwnProperty(value)) {
      value = result[value];
      if (value.startsWith('@')) {
        value = result[value.substring(1)];
      }
    }
    return value;
  }
}
