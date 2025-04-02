import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { MiniCardComponent } from "../mini-card/mini-card.component";
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { House } from '../../interfaces/house.interface';
import { BehaviorSubject, map, Observable, ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DataStoreService } from '../../services/data-store.service';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-catalog',
  imports: [MiniCardComponent, ScrollingModule, AsyncPipe],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent implements OnInit {
  houses$!: Observable<House[]>;

  _destroy: DestroyRef = inject(DestroyRef);

  constructor(private wordpressIntegrationService: WordpressIntegrationService, private dataStoreService: DataStoreService) { }

  track(index: number, item: House) {
    return item.post_id;
  }

  ngOnInit() {

    this.wordpressIntegrationService.getHouses().pipe(takeUntilDestroyed(this._destroy)).subscribe(data => {
      console.log(data)
      this.dataStoreService.setHouses(data);
      this.dataStoreService.setAllHouses(data);
    })

    this.houses$ = this.dataStoreService.houses$;

    // this.wordpressIntegrationService.getHouseById(806).pipe(takeUntil(this.destroySubscription)).subscribe(data => {
    //   console.log('request catalog')
    //   this.dataStoreService.setHouses(data);
    //   this.dataStoreService.setAllHouseshouses(data);
    // })
  }

}
