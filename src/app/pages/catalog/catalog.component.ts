import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { House } from '../../interfaces/house.interface';
import { BehaviorSubject, map, Observable, ReplaySubject, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DataStoreService } from '../../services/data-store.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MiniCardComponent } from '../../components/mini-card/mini-card.component';
import { SearchContainerComponent } from "../../components/search-container/search-container.component";
import { mountBackButton, showBackButton, onBackButtonClick, hideBackButton, unmountBackButton } from '@telegram-apps/sdk';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { LoaderService } from '../../services/loader.service';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-catalog',
  imports: [MiniCardComponent, LoaderComponent, ScrollingModule, AsyncPipe, HeaderComponent, NgIf],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent implements OnInit {

  isCollection = false;

  houses$!: Observable<House[]>;

  _destroy: DestroyRef = inject(DestroyRef);

  constructor(
    public loaderService: LoaderService,
    private wordpressIntegrationService: WordpressIntegrationService,
    private dataStoreService: DataStoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  track(index: number, item: House) {
    return item.post_id;
  }

  ngOnInit() {
    console.log(this.activatedRoute)
    this.activatedRoute.queryParamMap.pipe(
      tap(data => console.log(data)),
      switchMap(params => params.getAll('isCollection'))
    )
    .subscribe(params => {
      console.log(params)
      this.isCollection = Boolean(params);
    })

    if (!this.isCollection) {
      this.wordpressIntegrationService.getHouses().pipe(takeUntilDestroyed(this._destroy)).subscribe(data => {
        console.log(data)
        this.dataStoreService.setHouses(data);
        this.dataStoreService.setAllHouses(data);
      })
    }

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
