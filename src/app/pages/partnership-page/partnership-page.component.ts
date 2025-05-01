import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { mountBackButton, showBackButton, onBackButtonClick, unmountBackButton, hideBackButton } from '@telegram-apps/sdk';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partnership-page',
  imports: [HeaderComponent],
  templateUrl: './partnership-page.component.html',
  styleUrl: './partnership-page.component.scss'
})
export class PartnershipPageComponent {

  constructor(private router: Router) { }

  ngOnInit() {
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
