import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  // Время заезда и выезда приходит в формате 15:00:00, надо убирать милисекунды для вывода
  transform(value: string | undefined): unknown {
    if (value) {
      let array = value.split(':');
      return array[0] + ':' + array[1];
    }
    return value;
  }

}
