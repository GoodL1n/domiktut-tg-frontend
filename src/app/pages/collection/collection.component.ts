import { AsyncPipe, NgClass } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { HousesListComponent } from '../../components/houses-list/houses-list.component';
import { filter, map, Observable } from 'rxjs';
import { House } from '../../interfaces/house.interface';
import { HeaderComponent } from "../../components/header/header.component";
import { mountBackButton, showBackButton, onBackButtonClick, unmountBackButton, hideBackButton } from '@telegram-apps/sdk';
import { DataStoreService } from '../../services/data-store.service';

@Component({
  selector: 'app-collection',
  imports: [NgClass, HousesListComponent, HeaderComponent, AsyncPipe],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss'
})
export class CollectionComponent {
  houses$!: Observable<House[]>;

  collectionType = '';
  titleCollection = '';

  minHeight = '0px';

  _destroy: DestroyRef = inject(DestroyRef);

  constructor(private activatedRoute: ActivatedRoute,
    private dataStoreService: DataStoreService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(
        takeUntilDestroyed(this._destroy)
      )
      .subscribe(params => {
        this.collectionType = params['collectionType'];
        this.titleCollection = this.setCollectionName(params['collectionType']);
      });

    this.houses$ = this.dataStoreService.houses$.pipe(
      map(houses => {
        switch (this.collectionType) {
          case 'family':
            return houses.filter(house => Number(house.number_of_people) <= 12);
          case 'pool':
            return houses.filter(house => house.waterpool_catalog);
          case 'company':
            return houses.filter(house => Number(house.number_of_people) >= 25);
          default:
            return houses;
        }
      }),
      takeUntilDestroyed(this._destroy)
    );

    mountBackButton.ifAvailable();
    showBackButton();
    onBackButtonClick(() => {
      this.router.navigate(['']);
    });
  }

  setCollectionName(collectionType: string) {
    let collectionName = '';
    switch (collectionType) {
      case 'family':
        collectionName = 'семейные и уютные';
        break;
      case 'pool':
        collectionName = 'дома с бассейном';
        break;
      case 'company':
        collectionName = 'для большой компании';
        break;
    }
    return collectionName;
  }

  changeMinHeight(newHeight: number){
    this.minHeight = newHeight + 'px';
  }

  ngOnDestroy(): void {
    hideBackButton();

    unmountBackButton();
  }

}
