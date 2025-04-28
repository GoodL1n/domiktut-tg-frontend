import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, Input, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { House } from '../../interfaces/house.interface';
import { CommonService } from '../../services/common.service';
import { DataStoreService } from '../../services/data-store.service';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import {
  EmblaCarouselDirective,
  EmblaCarouselType,
  EmblaEventType
} from 'embla-carousel-angular'
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-mini-card',
  imports: [EmblaCarouselDirective, NgFor, AsyncPipe, NgIf],
  templateUrl: './mini-card.component.html',
  styleUrl: './mini-card.component.scss',
  providers: [CommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniCardComponent implements OnInit {
  @Input() house!: House;

  @ViewChild(EmblaCarouselDirective) emblaRef: EmblaCarouselDirective | undefined;
  private emblaApi?: EmblaCarouselType;
  options = {
    loop: true
  }

  isFav = false;

  public acountDotSignal = signal<number[]>([]);
  currendDot = 0;

  _destroy: DestroyRef = inject(DestroyRef);

  img: string = 'https://domiktut.ru/wp-content/uploads/2022/04/background_head-6.png';

  imgs = new BehaviorSubject<string[]>([]);

  constructor(private router: Router,
    private dataStoreService: DataStoreService,
    private wordpressIntegrationService: WordpressIntegrationService,
  ) { }

  track(index: number, item: string) {
    return item;
  }

  generateDots() {
    const lengthDots = this.emblaApi?.scrollSnapList().length;
    const dots = Array(lengthDots).fill(0);
    this.acountDotSignal.set(dots);
  }

  onEmblaChanged(event: EmblaEventType): void {
    this.emblaApi = this.emblaRef?.emblaApi;

    if (!this.emblaApi) {
      return;
    }

    if (event === 'init' || event === 'reInit') {
      this.generateDots();
    }

    if (event === 'scroll') {
      this.currendDot = this.emblaApi.selectedScrollSnap();
    }
  }

  handleScrollTo(index: number) {
    this.emblaApi?.scrollTo(index);
  }

  ngOnInit() {
    if (this.house.house_photo) {
      this.wordpressIntegrationService.getImagesUrl(this.house.house_photo, 3).pipe(takeUntilDestroyed(this._destroy)).subscribe(data => {
        console.log('current house imgs', this.house.post_id)
        console.log(data)
        const array = (data as Array<any>).map(element => {
          return 'https://domiktut.ru/wp-content/uploads/' + element.img_value;
        })
        this.imgs.next(array);
      })
    }

    // this.wordpressIntegrationService.getImagesUrl(this.house.house_photo, 1).pipe(takeUntilDestroyed(this._destroy)).subscribe(data => {
    //   console.log(data);
    //   this.img = 'https://domiktut.ru/wp-content/uploads/' + (data as Array<any>)[0].img_value;
    // })
  }

  ngAfterViewInit() {
    this.emblaApi = this.emblaRef?.emblaApi;
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
    if (this.house.post_id) this.dataStoreService.setCurrentHouseId(this.house.post_id);
    this.router.navigate(['card']);
  }
}
