import { Injectable } from '@angular/core';
import { House } from '../interfaces/house.interface';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  calcMinPrice(house: House) {
    let priceArray: number[] = [];

    [parseInt(house.friday_price || '0'), parseInt(house.sunday_price || '0'), parseInt(house.weekday_price || '0'),
    parseInt(house.weekend_price || '0'), parseInt(house.saturday_price || '0')]
      .map(element => {
        (element && element > 0) ? priceArray.push(element) : null;
      });

    const calc = Math.min(...priceArray);
    return (calc && calc > 0) ? (String(calc) + ' 000') : '0';
  }
}
