import { Component, DestroyRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { hideBackButton, mainButtonBackgroundColor, mountBackButton, mountMainButton, onBackButtonClick, onMainButtonClick, setMainButtonParams, showBackButton, unmountBackButton, unmountMainButton } from '@telegram-apps/sdk';
import { House } from '../../interfaces/house.interface';
import { CommonService } from '../../services/common.service';
import { LoaderService } from '../../services/loader.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { LoaderComponent } from '../../components/loader/loader.component';
import { DataStoreService } from '../../services/data-store.service';
import { BehaviorSubject, combineLatest, concatMap, filter, map, switchMap } from 'rxjs';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { EmblaCarouselDirective, EmblaCarouselType, EmblaEventType } from 'embla-carousel-angular';
import { HeaderComponent } from '../../components/header/header.component';
import { FormatTextToNumberPipe } from '../../pipes/format-text-to-number.pipe';
import { FormRequestComponent } from '../../components/form-request/form-request.component';
import { FavouritesService } from '../../services/favourites.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  isFormRequest = false;

  house!: House;

  imgs$ = new BehaviorSubject<string[]>([]);

  _destroy: DestroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private dataStoreService: DataStoreService,
    private wordpressIntegrationService: WordpressIntegrationService,
    private favouritesService: FavouritesService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.dataStoreService.currentHouseId$.pipe(
      filter((id) => !!id),
      concatMap((id) =>
        combineLatest(this.wordpressIntegrationService.getHouseById(id), this.favouritesService.userFavourites$)
          .pipe(
            map(data => {
              let house = data[0][0];
              const user = data[1];

              house.isFav = !!user.post_id_array?.find(id => Number(id) === house.post_id);
              return house;
            })
          )
      ),
      takeUntilDestroyed(this._destroy)
    ).subscribe(data => {
      this.house = data;
      this.dataStoreService.setCurrentHouse(data);
    });

    // поднять этот тунель выше, сделав одним последовательным и вызываемым единоразово после загрузки данных о доме
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

    mountMainButton.ifAvailable();
    setMainButtonParams({
      text: 'Оставить заявку',
      hasShineEffect: true,
      isEnabled: true,
      isVisible: true,
      backgroundColor: '#000000',
      textColor: '#FFFFFF'
    });
    mainButtonBackgroundColor();
    onMainButtonClick(() => this.isFormRequest = true);

    mountBackButton.ifAvailable();
    showBackButton();
    onBackButtonClick(() => {
      this.dataStoreService.setCurrentHouse({});
      this.dataStoreService.setCurrentHouseId(0);
      this.router.navigate(['../catalog']);
    });
  }

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

  routeNext() {
    this.isFormRequest = true;
  }

  routeBack() {
    this.router.navigate(['../catalog']);
  }

  changeFavourite() {
    this.house.isFav = !this.house.isFav;
    if (this.house.isFav) {
      this.favouritesService.addNewPostIdUser(this.house.post_id!)
        .pipe(
          takeUntilDestroyed(this._destroy)
        ).subscribe(
          data => this.favouritesService.setUserFavourites(data)
        );
    } else {
      this.favouritesService.deletePostIdUser(this.house.post_id!)
        .pipe(
          takeUntilDestroyed(this._destroy)
        ).subscribe(
          data => this.favouritesService.setUserFavourites(data)
        );
    }
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
