import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { deleteCloudStorageItem, disableVerticalSwipes, enableClosingConfirmation, expandViewport, getCloudStorageItem, init, miniAppReady, mountClosingBehavior, mountMiniApp, mountSwipeBehavior, mountViewport, retrieveLaunchParams, retrieveRawInitData, unmountClosingBehavior, unmountMiniApp, unmountSwipeBehavior, unmountViewport, viewport } from '@telegram-apps/sdk';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private router: Router){}

  async ngOnInit() {
    try {
      init();

      const data = retrieveLaunchParams();
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

    if (getCloudStorageItem.isAvailable()) {
      const geo = await getCloudStorageItem('geo');
      console.log('geo', geo);
      if (((typeof geo === 'object') && Object.keys(geo).length > 0 && geo['geo'] !== '')) {
        return;
      }
      this.router.navigate(['select-geo']);
    }
  }

  ngOnDestroy(): void {
    unmountViewport();
    unmountClosingBehavior();
    unmountSwipeBehavior();
    unmountMiniApp();
  }
}
