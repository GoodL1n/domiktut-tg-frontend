import { Component, EventEmitter, Output } from '@angular/core';
import { setCloudStorageItem } from '@telegram-apps/sdk';
import { DataStoreService } from '../../services/data-store.service';

@Component({
  selector: 'app-select-geo',
  imports: [],
  templateUrl: './select-geo.component.html',
  styleUrl: './select-geo.component.scss'
})
export class SelectGeoComponent {
  @Output() isGeoSelected = new EventEmitter<boolean>();

  constructor(private dataStoreService: DataStoreService) { }

  async setGeo(cityId: string) {
    this.isGeoSelected.emit(true);
    this.dataStoreService.setCityId(cityId);
    setCloudStorageItem.ifAvailable('geo', cityId);
  }
}
