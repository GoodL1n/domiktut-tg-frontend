import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { deleteCloudStorageItem, disableVerticalSwipes, enableClosingConfirmation, expandViewport, getCloudStorageItem, init, miniAppReady, mountClosingBehavior, mountMiniApp, mountSwipeBehavior, mountViewport, retrieveLaunchParams, retrieveRawInitData, unmountClosingBehavior, unmountMiniApp, unmountSwipeBehavior, unmountViewport, viewport } from '@telegram-apps/sdk';
import { DataStoreService } from './services/data-store.service';
import { FavouritesService } from './services/favourites.service';
import { combineLatest, distinctUntilChanged, filter, map, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  _destroy: DestroyRef = inject(DestroyRef);

  constructor(private router: Router,
    private dataStoreService: DataStoreService,
    private favouritesService: FavouritesService
  ) { }

  async ngOnInit() {
    try {
      init();

      mountViewport.ifAvailable();
      mountClosingBehavior.ifAvailable();
      mountSwipeBehavior.ifAvailable();
      mountMiniApp.ifAvailable();
    } catch (error) {
      console.error(error);
    }

    expandViewport.ifAvailable();
    enableClosingConfirmation.ifAvailable();
    disableVerticalSwipes.ifAvailable();
    miniAppReady.ifAvailable();

    const data = retrieveLaunchParams();
    if (data) {
      const user = data.tgWebAppData?.user;
      if (user?.username) {
        this.favouritesService.setUsername(user?.username);
        this.favouritesService.getUserFavourites(user?.username)
          .pipe(
            take(1)
          )
          .subscribe(data => {
            console.log('данные пользователя', data)
            this.favouritesService.setUserFavourites(data)
          });
      }
    }

    combineLatest(
      this.dataStoreService.allHouses$
        .pipe(
          filter(houses => houses.length !== 0)
        ),
      this.favouritesService.userFavourites$
        .pipe(
          filter(userFav => userFav && Object.keys(userFav).length > 0)
        )
    )
      .pipe(
        distinctUntilChanged((a, b) => a[1].post_id_array?.length === b[1].post_id_array?.length),
        tap(data => console.log('обнова', data[0].length, data[1])),
        map((data) => {
          let houses = data[0];
          let userFavourites = data[1];

          houses.map(house => {
            house.isFav = !!userFavourites.post_id_array?.find(id => Number(id) === house.post_id);
            return house;
          })

          this.dataStoreService.setHouses(houses);
          this.dataStoreService.setAllHouses(houses);
        }),
        takeUntilDestroyed(this._destroy)
      ).subscribe()

    deleteCloudStorageItem('geo');

    if (getCloudStorageItem.isAvailable()) {
      const geo = await getCloudStorageItem('geo');
      console.log('geo', geo);
      if (((typeof geo === 'object') && Object.keys(geo).length > 0 && geo['geo'] !== '')) {
        console.log('geo is not empty', geo['geo']);
        this.dataStoreService.setCityId(geo['geo']);
        return;
      } else {
        console.log('geo is empty');
        this.router.navigate(['select-geo']);
      }
    }
  }

  ngOnDestroy(): void {
    unmountViewport();
    unmountClosingBehavior();
    unmountSwipeBehavior();
    unmountMiniApp();
  }
}
