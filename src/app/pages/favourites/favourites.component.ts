import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HousesListComponent } from "../../components/houses-list/houses-list.component";
import { Observable } from 'rxjs';
import { House } from '../../interfaces/house.interface';
import { AsyncPipe } from '@angular/common';
import { mountBackButton, showBackButton, onBackButtonClick, hideBackButton, unmountBackButton } from '@telegram-apps/sdk';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favourites',
  imports: [HeaderComponent, HousesListComponent, AsyncPipe],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss'
})
export class FavouritesComponent {
  favouritesHouses$!: Observable<House[]>;

  constructor(private router: Router){}

  ngOnInit(): void {
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
