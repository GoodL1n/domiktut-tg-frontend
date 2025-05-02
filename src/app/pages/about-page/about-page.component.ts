import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { mountBackButton, showBackButton, onBackButtonClick, unmountBackButton, hideBackButton } from '@telegram-apps/sdk';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-page',
  imports: [HeaderComponent],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss'
})
export class AboutPageComponent {
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
