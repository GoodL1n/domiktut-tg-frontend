import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { hideBackButton, mainButtonBackgroundColor, mountBackButton, mountMainButton, onBackButtonClick, onMainButtonClick, setMainButtonParams, showBackButton, unmountBackButton, unmountMainButton } from '@telegram-apps/sdk';
import { House } from '../../interfaces/house.interface';
import { testData } from '../../test-data';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  providers: [CommonService]
})
export class CardComponent implements OnInit, OnDestroy {

  house: House = testData[0];
  minPrice: string = '';

  constructor(private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    console.log(this.house)
    this.minPrice = this.commonService.calcMinPrice(this.house);

    // mountMainButton.ifAvailable();
    // setMainButtonParams({
    //   text: 'Оставить заявку',
    //   hasShineEffect: true,
    //   isEnabled: true,
    //   isVisible: true,
    //   backgroundColor: '#F4683F',
    //   textColor: '#FFFFFF'
    // });
    // mainButtonBackgroundColor();
    // onMainButtonClick(() => this.router.navigate(['form-request']));

    // mountBackButton.ifAvailable();
    // showBackButton();
    // onBackButtonClick(() => this.router.navigate(['']));
  }

  ngOnDestroy(): void {
    setMainButtonParams({
      isEnabled: false,
      isVisible: false,
    });
    unmountMainButton();

    hideBackButton();

    unmountBackButton();
  }

}
