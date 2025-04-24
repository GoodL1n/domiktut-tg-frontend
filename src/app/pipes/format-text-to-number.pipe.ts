import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTextToNumber'
})
export class FormatTextToNumberPipe implements PipeTransform {

  transform(value: string | undefined): any {
    if(value){
      return value.split(' ')[0];
    }
  }

}
