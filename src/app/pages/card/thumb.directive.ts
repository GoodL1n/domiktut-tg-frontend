import { Directive, ElementRef } from '@angular/core';
import EmblaCarousel from 'embla-carousel';
import { EmblaCarouselType } from 'embla-carousel-angular';

@Directive({
  selector: '[thumbEmblaCarousel]'
})
export class ThumbDirective {

  public emplaApi!: EmblaCarouselType;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    this.emplaApi = EmblaCarousel(this.elementRef.nativeElement,
      {
        containScroll: 'keepSnaps',
        dragFree: true
      }
    )
  }

}
