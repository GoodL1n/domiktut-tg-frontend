import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { hideBackButton, mainButtonBackgroundColor, mountBackButton, mountMainButton, onBackButtonClick, onMainButtonClick, setMainButtonParams, showBackButton, unmountBackButton, unmountMainButton } from '@telegram-apps/sdk';
import { House } from '../../interfaces/house.interface';
import { CommonService } from '../../services/common.service';
import { LoaderService } from '../../services/loader.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { LoaderComponent } from '../../components/loader/loader.component';
import { DataStoreService } from '../../services/data-store.service';
import { BehaviorSubject, filter, map, switchMap } from 'rxjs';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { EmblaCarouselDirective, EmblaCarouselType, EmblaEventType } from 'embla-carousel-angular';
import { HeaderComponent } from '../../components/header/header.component';
import { FormatTextToNumberPipe } from '../../pipes/format-text-to-number.pipe';
import { FormRequestComponent } from '../../components/form-request/form-request.component';

@Component({
  selector: 'app-card',
  imports: [LoaderComponent, HeaderComponent, FormRequestComponent, AsyncPipe, FormatTextToNumberPipe, EmblaCarouselDirective, NgFor, NgIf],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  providers: [CommonService]
})
export class CardComponent implements OnInit, OnDestroy {

  @ViewChild(EmblaCarouselDirective) emblaRef: EmblaCarouselDirective | undefined;
  private emblaApi?: EmblaCarouselType;
  options = {
    loop: true
  }

  isFav = false;

  isFormRequest = false;

  house!: House;

  imgs$ = new BehaviorSubject<string[]>([]);

  constructor(
    private router: Router,
    private commonService: CommonService,
    private dataStoreService: DataStoreService,
    private wordpressIntegrationService: WordpressIntegrationService,
    public loaderService: LoaderService
  ) { }

  track(index: number, item: string) {
    return item;
  }

  onEmblaChanged(event: EmblaEventType): void {
    this.emblaApi = this.emblaRef?.emblaApi;

    if (!this.emblaApi) {
      return;
    }

    if (event === 'init' || event === 'reInit') {

    }

    if (event === 'scroll') {
      // this.currendDot = this.emblaApi.selectedScrollSnap();
    }
  }

  handleScrollTo(index: number) {
    this.emblaApi?.scrollTo(index);
  }

  ngOnInit(): void {
    this.dataStoreService.currentHouseId$.pipe(
      filter((id) => !!id),
      switchMap((id) => this.wordpressIntegrationService.getHouseById(id))
    ).subscribe(data => {
      if (data && data.length > 0) {
        this.house = data[0];
        this.dataStoreService.setCurrentHouse(data[0]);
      }
    });

    this.dataStoreService.currentHouse$.pipe(
      filter((house) => (Object.keys(house).length > 0 && !!house.house_photo)),
      switchMap((house) => this.wordpressIntegrationService.getImagesUrl(house.house_photo!, 4)))
      .subscribe(data => {
        console.log('current house imgs', this.house.post_id)
        console.log(data)
        const array = (data as Array<any>).map(element => {
          return 'https://domiktut.ru/wp-content/uploads/' + element.img_value;
        })
        this.dataStoreService.setCurrentHouseImgs(array);
        this.imgs$.next(array);
      });

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
    // onMainButtonClick(() => this.isFormRequest = true);

    // mountBackButton.ifAvailable();
    // showBackButton();
    // onBackButtonClick(() => {
    //   this.dataStoreService.setCurrentHouse({});
    //   this.dataStoreService.setCurrentHouseId(0);
    //   this.router.navigate(['../catalog']);
    // });
  }

  routeNext() {
    this.isFormRequest = true;
  }

  routeBack() {
    this.router.navigate(['../catalog']);
  }

  ngOnDestroy(): void {
    // setMainButtonParams({
    //   isEnabled: false,
    //   isVisible: false,
    // });
    // unmountMainButton();

    // hideBackButton();

    // unmountBackButton();
  }

}
