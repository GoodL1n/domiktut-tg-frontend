import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { House } from '../../interfaces/house.interface';
import { CommonService } from '../../services/common.service';
import { DataStoreService } from '../../services/data-store.service';

@Component({
  selector: 'app-mini-card',
  imports: [],
  templateUrl: './mini-card.component.html',
  styleUrl: './mini-card.component.scss',
  providers: [CommonService]
})
export class MiniCardComponent implements OnInit {
  @Input() house!: House;
  @Input() isOpenInFormRequest: boolean = false;

  minPrice: string = '';

  constructor(private router: Router,
    private commonService: CommonService,
    private dataStoreService: DataStoreService
  ) { }

  ngOnInit() {
    this.minPrice = this.commonService.calcMinPrice(this.house);
  }

  route() {
    if (!this.isOpenInFormRequest) {
      if (this.house.post_id) this.dataStoreService.setCurrentHouseId(this.house.post_id);
      this.router.navigate(['card']);
    }
  }
}
