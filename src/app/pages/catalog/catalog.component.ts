import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { House } from '../../interfaces/house.interface';
import { BehaviorSubject, map, Observable, ReplaySubject, Subject, switchMap, take, takeUntil, tap, combineLatest, distinctUntilChanged, concatMap } from 'rxjs';
import { DataStoreService } from '../../services/data-store.service';
import { AsyncPipe, NgClass, NgIf, NgStyle } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchContainerComponent } from "../../components/search-container/search-container.component";
import { mountBackButton, showBackButton, onBackButtonClick, hideBackButton, unmountBackButton } from '@telegram-apps/sdk';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { LoaderService } from '../../services/loader.service';
import { LoaderComponent } from '../../components/loader/loader.component';
import { HousesListComponent } from "../../components/houses-list/houses-list.component";
import { SearchStartComponent } from "../../components/search-start/search-start.component";
import { FilterContrainerComponent } from "../../components/filter-contrainer/filter-contrainer.component";
import { Filter } from '../../interfaces/filter.interface';

@Component({
  selector: 'app-catalog',
  imports: [LoaderComponent, SearchContainerComponent, AsyncPipe, HeaderComponent, HousesListComponent, SearchStartComponent, NgIf, NgClass, FilterContrainerComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  houses$!: Observable<House[]>;

  isSearchContainer = false;
  isFilterContainer = false;

  minHeight = '0px';

  _destroy: DestroyRef = inject(DestroyRef);

  constructor(
    public loaderService: LoaderService,
    private dataStoreService: DataStoreService,
    private router: Router) { }

  ngOnInit() {
    this.houses$ = this.dataStoreService.filter$
      .pipe(
        tap(filters => console.log('catalog filters', filters)),
        concatMap((filter) => this.dataStoreService.allHouses$.pipe(
          map(houses => {
            if (houses.length === 0 || Object.keys(filter).length === 0) {
              return houses;
            }

            return this.filterArrayHouse(houses, filter);
          }),
          tap(houses => console.log('catalog filtered houses', houses))
        )),
        takeUntilDestroyed(this._destroy)
      )

    mountBackButton.ifAvailable();
    showBackButton();
    onBackButtonClick(() => {
      this.router.navigate(['']);
    });
  }

  filterArrayHouse(houses: House[], filters: Filter) {
    let filteredArray = [];

    for (let i = 0; i < houses.length; i++) {
      if (filters.post_id && !filters.post_id.find(id => houses[i].post_id === id)) {
        continue;
      }

      if (filters.number_of_people && houses[i].number_of_people && parseInt(houses[i].number_of_people!) <= filters.number_of_people) {
        continue;
      }

      if (filters.number_of_bedrooms && houses[i].number_of_bedrooms && parseInt(houses[i].number_of_bedrooms!.replace(/[^0-9]/g, "")) <= filters.number_of_bedrooms) {
        continue;
      }

      if (filters.number_of_beds && houses[i].number_of_beds && parseInt(houses[i].number_of_beds!.replace(/[^0-9]/g, ""))! <= filters.number_of_beds) {
        continue;
      }

      if (filters.pool && !houses[i].waterpool_catalog) {
        continue;
      }

      filteredArray.push(houses[i]);
    }

    return filteredArray;
  }

  changeMinHeight(newHeight: number) {
    this.minHeight = newHeight + 'px';
  }

  ngOnDestroy(): void {
    hideBackButton();

    unmountBackButton();
  }
}
