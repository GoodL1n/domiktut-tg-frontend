import { Component, DestroyRef, inject } from '@angular/core';
import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LoaderComponent } from '../../components/loader/loader.component';
import { LoaderService } from '../../services/loader.service';
import { getCloudStorageItem } from '@telegram-apps/sdk';
import { DataStoreService } from '../../services/data-store.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FormRequestComponent } from '../../components/form-request/form-request.component';
import { SearchStartComponent } from "../../components/search-start/search-start.component";
import { SearchContainerComponent } from "../../components/search-container/search-container.component";
import { concatMap, filter, map } from 'rxjs';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-main-page',
  imports: [ScrollingModule, HeaderComponent, LoaderComponent, FormRequestComponent, AsyncPipe, RouterLink, NgIf, SearchStartComponent, SearchContainerComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  isGeoSelected = false;
  isFormRequest = false;
  isSearchContainer = false;

  _destroy: DestroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    public loaderService: LoaderService,
    private dataStoreService: DataStoreService,
    private wordpressIntegrationService: WordpressIntegrationService
  ) {
    this.loaderService.setIsLoading(true);
  }

  async ngOnInit() {
    if (getCloudStorageItem.isAvailable()) {
      const geo = await getCloudStorageItem('geo');
      console.log('geo', geo);
      if (((typeof geo === 'object') && Object.keys(geo).length > 0 && geo['geo'] !== '')) {
        this.loaderService.setIsLoading(false);
        return;
      }
      this.router.navigate(['select-geo']);
    }
    this.loaderService.setIsLoading(false);

    this.dataStoreService.allHouses$.pipe(
      filter(houses => houses.length === 0),
      concatMap(() => this.wordpressIntegrationService.getHouses().pipe(
        takeUntilDestroyed(this._destroy),
        map(data => {
          this.dataStoreService.setHouses(data);
          this.dataStoreService.setAllHouses(data);
        })
      ))
    ).subscribe();
  }


}
