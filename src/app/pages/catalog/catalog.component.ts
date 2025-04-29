import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { House } from '../../interfaces/house.interface';
import { BehaviorSubject, map, Observable, ReplaySubject, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
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

@Component({
  selector: 'app-catalog',
  imports: [LoaderComponent, SearchContainerComponent, AsyncPipe, HeaderComponent, HousesListComponent, SearchStartComponent, NgIf, FilterContrainerComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  houses$!: Observable<House[]>;

  isSearchContainer = false;
  isFilterContainer = false;

  _destroy: DestroyRef = inject(DestroyRef);

  constructor(
    public loaderService: LoaderService,
    private dataStoreService: DataStoreService,
    private router: Router) { }

  ngOnInit() {
    this.houses$ = this.dataStoreService.houses$;

    mountBackButton.ifAvailable();
    showBackButton();
    onBackButtonClick(() => {
      this.router.navigate(['']);
    });
  }

  ngOnDestroy(): void {
    hideBackButton();

    unmountBackButton();
  }

}
