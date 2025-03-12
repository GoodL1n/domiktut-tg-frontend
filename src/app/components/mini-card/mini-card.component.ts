import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { House } from '../../interfaces/house.interface';

@Component({
  selector: 'app-mini-card',
  imports: [],
  templateUrl: './mini-card.component.html',
  styleUrl: './mini-card.component.scss'
})
export class MiniCardComponent {
  @Input() house!: House;

  constructor(private router: Router){}

  route(){
    this.router.navigate(['card']);
  }
}
