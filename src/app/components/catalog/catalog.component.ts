import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MiniCardComponent } from "../mini-card/mini-card.component";
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { House } from '../../interfaces/house.interface';
import { BehaviorSubject, map, Observable, ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DataStoreService } from '../../services/data-store.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-catalog',
  imports: [MiniCardComponent, ScrollingModule, AsyncPipe],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit, OnDestroy {
  houses$!: Observable<House[]>;

  destroySubscription: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private wordpressIntegrationService: WordpressIntegrationService, private dataStoreService: DataStoreService) { }

  ngOnInit() {

    this.houses$ = this.dataStoreService.houses$;

    this.wordpressIntegrationService.getHouses().pipe(takeUntil(this.destroySubscription)).subscribe(data => {
      this.dataStoreService.setHouses(data);
      this.dataStoreService.setAllHouses(data);
    })

    // this.wordpressIntegrationService.getHouseById(806).pipe(takeUntil(this.destroySubscription)).subscribe(data => {
    //   console.log('request catalog')
    //   this.dataStoreService.setHouses(data);
    //   this.dataStoreService.setAllHouseshouses(data);
    // })
  }

  ngOnDestroy(): void {
    this.destroySubscription.next(true);
    this.destroySubscription.complete();
  }

}
