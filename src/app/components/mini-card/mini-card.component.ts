import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { House } from '../../interfaces/house.interface';
import { CommonService } from '../../services/common.service';
import { DataStoreService } from '../../services/data-store.service';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-mini-card',
  imports: [],
  templateUrl: './mini-card.component.html',
  styleUrl: './mini-card.component.scss',
  providers: [CommonService],
})
export class MiniCardComponent implements OnInit {
  @Input() house!: House;
  @Input() isOpenInFormRequest: boolean = false;

  _destroy: DestroyRef = inject(DestroyRef);

  img: string = 'https://domiktut.ru/wp-content/uploads/2022/04/background_head-6.png'

  imgs = new BehaviorSubject<string[]>([]);
  constructor(private router: Router,
    private commonService: CommonService,
    private dataStoreService: DataStoreService,
    private wordpressIntegrationService: WordpressIntegrationService
  ) { }

  ngOnInit() {
    if (this.house.house_photo) {
      this.wordpressIntegrationService.getImagesUrl(this.house.house_photo, 1).pipe(takeUntilDestroyed(this._destroy)).subscribe(data => {
        console.log(data);
        this.img = 'https://domiktut.ru/wp-content/uploads/' + (data as Array<any>)[0].img_value;
      })
    }

    // this.wordpressIntegrationService.getImagesUrl(this.house.house_photo, 3).pipe(takeUntilDestroyed(this._destroy)).subscribe(data => {
    //   console.log(data);
    //   const array = (data as Array<any>).map(element => {
    //     return 'https://domiktut.ru/wp-content/uploads/' + element.img_value;
    //   })
    //   this.imgs.next(array);
    // })
  }

  calcMinPrice(house: House) {
    let priceArray: number[] = [];

    [parseInt(house.friday_price || '0'), parseInt(house.sunday_price || '0'), parseInt(house.weekday_price || '0'),
    parseInt(house.weekend_price || '0'), parseInt(house.saturday_price || '0')]
      .map(element => {
        (element && element > 0) ? priceArray.push(element) : null;
      });

    const calc = Math.min(...priceArray);
    return (calc && calc > 0) ? (String(calc) + ' 000') : '0';
  }

  route() {
    if (!this.isOpenInFormRequest) {
      if (this.house.post_id) this.dataStoreService.setCurrentHouseId(this.house.post_id);
      this.router.navigate(['card']);
    }
  }
}
