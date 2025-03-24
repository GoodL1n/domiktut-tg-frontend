import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MiniCardComponent } from "../mini-card/mini-card.component";
import { AsyncPipe, NgFor } from '@angular/common';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { House } from '../../interfaces/house.interface';
import { testData } from '../../test-data';
import { BehaviorSubject, fromEvent, map, Observable, ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DataStoreService } from '../../services/data-store.service';
import { H } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-catalog',
  imports: [MiniCardComponent, ScrollingModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit, OnDestroy {
  houses$!: Observable<House[]>;
  size: number = 0;

  destroySubscription: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private wordpressIntegrationService: WordpressIntegrationService, private dataStoreService: DataStoreService) { }

  ngOnInit() {

    this.houses$ = this.dataStoreService.houses$;

    this.dataStoreService.houses$.pipe(map(houses => this.size = houses.length), takeUntil(this.destroySubscription));

    this.wordpressIntegrationService.getHouses().pipe(takeUntil(this.destroySubscription)).subscribe(data => {
      console.log('request')
      this.dataStoreService.setHouses(data);
      this.dataStoreService.setAllHouseshouses(data);
    })
  }

  ngOnDestroy(): void {
    console.log('destroy');
    this.destroySubscription.next(true);
    this.destroySubscription.complete();
  }

}
