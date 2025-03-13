import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { House } from '../../interfaces/house.interface';

@Component({
  selector: 'app-mini-card',
  imports: [],
  templateUrl: './mini-card.component.html',
  styleUrl: './mini-card.component.scss'
})
export class MiniCardComponent implements OnInit {
  @Input() house!: House;

  minPrice: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.minPrice = this.calcMinPrice();
  }

  calcMinPrice() {
    let priceArray: number[] = [];

    [parseInt(this.house.friday_price || '0'), parseInt(this.house.sunday_price || '0'),
    parseInt(this.house.weekday_price || '0'), parseInt(this.house.weekend_price || '0'), parseInt(this.house.saturday_price || '0')]
      .map(element => {
        console.log(element);
        (element && element > 0) ? priceArray.push(element) : null;
      });

    const calc = Math.min(...priceArray);
    return calc && calc > 0 ? String(calc) + ' 000' : '0';
  }

  route() {
    this.router.navigate(['card']);
  }
}
