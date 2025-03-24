import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { hideBackButton, mainButtonBackgroundColor, mountBackButton, mountMainButton, onBackButtonClick, onMainButtonClick, setMainButtonParams, showBackButton, unmountBackButton, unmountMainButton } from '@telegram-apps/sdk';
import { House } from '../../interfaces/house.interface';
import { testData } from '../../test-data';
import { CommonService } from '../../services/common.service';
import { LoaderService } from '../../services/loader.service';
import { AsyncPipe } from '@angular/common';
import { LoaderComponent } from '../../components/loader/loader.component';
import { DataStoreService } from '../../services/data-store.service';
import { map, switchMap } from 'rxjs';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';

@Component({
  selector: 'app-card',
  imports: [LoaderComponent, AsyncPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  providers: [CommonService]
})
export class CardComponent implements OnInit, OnDestroy {

  house!: House;
  minPrice: string = '';

  constructor(private router: Router,
    private commonService: CommonService,
    private dataStoreService: DataStoreService,
    private wordpressIntegrationService: WordpressIntegrationService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.dataStoreService.currentHouseId$.pipe(
      switchMap((id) => this.wordpressIntegrationService.getHouseById(id))
    ).subscribe(data => {
      if (data && data.length > 0) {
        this.house = data[0];
        this.dataStoreService.setCurrentHouse(data[0]);
        this.minPrice = this.commonService.calcMinPrice(this.house);
      }
    });


    mountMainButton.ifAvailable();
    setMainButtonParams({
      text: 'Оставить заявку',
      hasShineEffect: true,
      isEnabled: true,
      isVisible: true,
      backgroundColor: '#F4683F',
      textColor: '#FFFFFF'
    });
    mainButtonBackgroundColor();
    onMainButtonClick(() => this.router.navigate(['form-request']));

    mountBackButton.ifAvailable();
    showBackButton();
    onBackButtonClick(() => this.router.navigate(['']));
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
