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

@Component({
  selector: 'app-catalog',
  imports: [LoaderComponent, SearchContainerComponent, AsyncPipe, HeaderComponent, HousesListComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  houses$!: Observable<House[]>;

  _destroy: DestroyRef = inject(DestroyRef);

  constructor(
    public loaderService: LoaderService,
    private wordpressIntegrationService: WordpressIntegrationService,
    private dataStoreService: DataStoreService,
    private router: Router) { }

  ngOnInit() {
    this.wordpressIntegrationService.getHouses().pipe(
      takeUntilDestroyed(this._destroy)
    ).subscribe(data => {
      this.dataStoreService.setHouses(data);
      this.dataStoreService.setAllHouses(data);
    })

    this.houses$ = this.dataStoreService.houses$;

    // this.wordpressIntegrationService.getHouseById(806).pipe().subscribe(data => {
    //   console.log('request catalog')
    //   this.dataStoreService.setHouses(data);
    //   this.dataStoreService.setAllHouses(data);
    // })

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
