import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { hideBackButton, mountBackButton, mountMainButton, onBackButtonClick, onMainButtonClick, setMainButtonParams, showBackButton, unmountBackButton, unmountMainButton } from '@telegram-apps/sdk';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }

  ngOnInit(): void {
    mountMainButton.ifAvailable();
    setMainButtonParams({
      text: 'Оставить заявку',
      hasShineEffect: true,
      isEnabled: true,
      isVisible: true,
      backgroundColor: '#F4683F',
      textColor: '#FFFFFF'
    });
    onMainButtonClick(() => this.router.navigate(['form-request']));

    mountBackButton.ifAvailable();
    showBackButton();
    onBackButtonClick(() => this.router.navigate(['']));
  }

  ngOnDestroy(): void {
    setMainButtonParams({
      isEnabled: false,
      isVisible: false,
    });
    unmountMainButton();

    hideBackButton();

    unmountBackButton();
  }

}
