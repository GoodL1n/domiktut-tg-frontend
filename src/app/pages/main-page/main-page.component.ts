import { Component } from '@angular/core';
import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LoaderComponent } from '../../components/loader/loader.component';
import { LoaderService } from '../../services/loader.service';
import { getCloudStorageItem } from '@telegram-apps/sdk';
import { DataStoreService } from '../../services/data-store.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FormRequestComponent } from '../../components/form-request/form-request.component';

@Component({
  selector: 'app-main-page',
  imports: [ScrollingModule, HeaderComponent, LoaderComponent, FormRequestComponent, AsyncPipe, RouterLink, NgIf],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  isGeoSelected = false;
  isFormRequest = false;

  constructor(
    private router: Router,
    public loaderService: LoaderService,
    private dataStoreService: DataStoreService
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
  }
}
