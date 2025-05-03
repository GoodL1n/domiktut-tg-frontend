import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HousesListComponent } from "../../components/houses-list/houses-list.component";
import { concatMap, filter, forkJoin, map, Observable } from 'rxjs';
import { House } from '../../interfaces/house.interface';
import { AsyncPipe } from '@angular/common';
import { mountBackButton, showBackButton, onBackButtonClick, hideBackButton, unmountBackButton } from '@telegram-apps/sdk';
import { Router } from '@angular/router';
import { FavouritesService } from '../../services/favourites.service';
import { DataStoreService } from '../../services/data-store.service';

@Component({
  selector: 'app-favourites',
  imports: [HeaderComponent, HousesListComponent, AsyncPipe],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss'
})
export class FavouritesComponent {
  favouritesHouses$!: Observable<House[]>;

  constructor(private router: Router,
    private favouritesService: FavouritesService,
    private dataStoreService: DataStoreService
  ) { }

  ngOnInit(): void {
    this.favouritesHouses$ = this.dataStoreService.allHouses$
      .pipe(
        map(houses => {
          return houses.filter(house => house.isFav)
        })
      )

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
