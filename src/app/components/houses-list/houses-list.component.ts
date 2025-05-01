import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { House } from '../../interfaces/house.interface';
import { MiniCardComponent } from '../mini-card/mini-card.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-houses-list',
  imports: [ScrollingModule, MiniCardComponent, AsyncPipe],
  templateUrl: './houses-list.component.html',
  styleUrl: './houses-list.component.scss'
})
export class HousesListComponent {
  @Output() changeSize = new EventEmitter<number>;
  @Input() houses$!: Observable<House[]>;

  @ViewChild(CdkVirtualScrollViewport) virtualScrollViewport?: CdkVirtualScrollViewport;

  currentSize: number | undefined = 0;

  ngAfterViewChecked(): void {
    if (this.currentSize === this.virtualScrollViewport?.elementRef.nativeElement.clientHeight) {
      return;
    } else {
      this.currentSize = this.virtualScrollViewport?.elementRef.nativeElement.clientHeight;
      this.changeSize.emit(this.virtualScrollViewport?.elementRef.nativeElement.clientHeight);
    }
  }

  track(index: number, item: House) {
    return item.post_id;
  }
}
