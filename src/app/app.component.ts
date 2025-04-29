import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { deleteCloudStorageItem, disableVerticalSwipes, enableClosingConfirmation, expandViewport, getCloudStorageItem, init, miniAppReady, mountClosingBehavior, mountMiniApp, mountSwipeBehavior, mountViewport, retrieveRawInitData, unmountClosingBehavior, unmountMiniApp, unmountSwipeBehavior, unmountViewport, viewport } from '@telegram-apps/sdk';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  async ngOnInit() {
    try {
      init();

      const data = retrieveRawInitData();
      console.log('start', data);

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

    deleteCloudStorageItem('geo');
  }

  ngOnDestroy(): void {
    unmountViewport();
    unmountClosingBehavior();
    unmountSwipeBehavior();
    unmountMiniApp();
  }
}
