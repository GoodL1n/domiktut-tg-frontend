import { Component } from '@angular/core';
import { setCloudStorageItem } from '@telegram-apps/sdk';
import { DataStoreService } from '../../services/data-store.service';
import { HeaderComponent } from '../../components/header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-geo',
  imports: [HeaderComponent],
  templateUrl: './select-geo.component.html',
  styleUrl: './select-geo.component.scss'
})
export class SelectGeoComponent {
  constructor(private dataStoreService: DataStoreService,
    private router: Router
  ) { }

  setGeo(cityId: string) {
    this.dataStoreService.setCityId(cityId);
    setCloudStorageItem.ifAvailable('geo', cityId);
    this.router.navigate(['']);
    
  }
}
