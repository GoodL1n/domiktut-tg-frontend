import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { hideBackButton, mountBackButton, onBackButtonClick, showBackButton, unmountBackButton } from '@telegram-apps/sdk';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit, OnDestroy {

  constructor(private router: Router){}

  ngOnInit(): void {
    mountBackButton.ifAvailable();
    showBackButton();
    onBackButtonClick(() => this.router.navigate(['']));
  }

  ngOnDestroy(): void {
      hideBackButton();

      unmountBackButton();
  }

}
