import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { House } from '../../interfaces/house.interface';
import { map, Observable, tap, combineLatest} from 'rxjs';
import { DataStoreService } from '../../services/data-store.service';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
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
    this.houses$ = combineLatest(
      this.dataStoreService.filter$,
      this.dataStoreService.allHouses$
    ).pipe(
      tap(([filter, houses]) => console.log('current filters', filter)),
      // distinctUntilChanged((a, b) => Object.keys(a[0]).length === Object.keys(b[0]).length),
      map(([filter, houses]) => {
        if (houses.length === 0 || Object.keys(filter).length === 0) {
          return houses;
        }

        return this.filterArrayHouse(houses, filter);
      }),
      tap(houses => console.log('catalog filtered houses', houses.length))
    );

    mountBackButton.ifAvailable();
    showBackButton();
    onBackButtonClick(() => {
      this.router.navigate(['']);
      this.dataStoreService.setFilter({});
    });
  }

  filterArrayHouse(houses: House[], filters: Filter) {
    let filteredArray = [];

    for (let i = 0; i < houses.length; i++) {
      if (filters.postIdFilteredByDate && !filters.postIdFilteredByDate.find(id => houses[i].post_id === id)) {
        continue;
      }

      if (filters.postIdFilteredByName && !filters.postIdFilteredByName.find(id => houses[i].post_id === id)) {
        continue;
      }

      if (filters.numberOfPeople && houses[i].number_of_people && parseInt(houses[i].number_of_people!) <= filters.numberOfPeople) {
        continue;
      }

      if (filters.numberOfBedrooms && houses[i].number_of_bedrooms && parseInt(houses[i].number_of_bedrooms!.replace(/[^0-9]/g, "")) <= filters.numberOfBedrooms) {
        continue;
      }

      if (filters.numberOfBeds && houses[i].number_of_beds && parseInt(houses[i].number_of_beds!.replace(/[^0-9]/g, ""))! <= filters.numberOfBeds) {
        continue;
      }

      if (filters.isPool && !houses[i].waterpool_catalog) {
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
