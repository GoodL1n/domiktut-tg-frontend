import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { House } from '../../interfaces/house.interface';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-mini-card',
  imports: [],
  templateUrl: './mini-card.component.html',
  styleUrl: './mini-card.component.scss',
  providers: [CommonService]
})
export class MiniCardComponent implements OnInit {
  @Input() house!: House;

  minPrice: string = '';

  constructor(private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.minPrice = this.commonService.calcMinPrice(this.house);
  }

  route() {
    this.router.navigate(['card']);
  }
}
