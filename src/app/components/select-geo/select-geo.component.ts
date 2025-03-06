import { Component, EventEmitter, Output } from '@angular/core';
import { setCloudStorageItem } from '@telegram-apps/sdk';

@Component({
  selector: 'app-select-geo',
  imports: [],
  templateUrl: './select-geo.component.html',
  styleUrl: './select-geo.component.scss'
})
export class SelectGeoComponent {
  @Output() isGeoSelected = new EventEmitter<boolean>();

  async setGeo(geo: string){
    this.isGeoSelected.emit(true);
    setCloudStorageItem.ifAvailable('geo', geo);
  }
}
