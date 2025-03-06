import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { disableVerticalSwipes, enableClosingConfirmation, expandViewport, getCloudStorageItem, init, miniAppReady, mountClosingBehavior, mountMiniApp, mountSwipeBehavior, mountViewport, unmountClosingBehavior, unmountMiniApp, unmountSwipeBehavior, unmountViewport, viewport } from '@telegram-apps/sdk';
import { HeaderComponent } from "./components/header/header.component";
import { SearchContainerComponent } from "./components/search-container/search-container.component";
import { SelectGeoComponent } from "./components/select-geo/select-geo.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SelectGeoComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  isGeoSelected = false;

  change(event: boolean){
    this.isGeoSelected = event;
  }
  async ngOnInit() {
    try {
      init();

      mountViewport.ifAvailable();
      mountClosingBehavior.ifAvailable();
      mountSwipeBehavior.ifAvailable();
      mountMiniApp.ifAvailable();
    } catch (error) {
      console.error(error);
    }

    expandViewport.ifAvailable();
    enableClosingConfirmation.ifAvailable();
    disableVerticalSwipes.ifAvailable();
    miniAppReady.ifAvailable();

    if (getCloudStorageItem.isAvailable()) {
      const geo = await getCloudStorageItem('geo');
      console.log('geo', geo);
      const geo2 = await getCloudStorageItem('geo2');
      console.log('geo2', geo2);
      this.isGeoSelected = (typeof geo === 'object') ? Object.keys(geo).length > 0 : false;
    }
  }

  ngOnDestroy(): void {
    unmountViewport();
    unmountClosingBehavior();
    unmountSwipeBehavior();
    unmountMiniApp();
  }
}
