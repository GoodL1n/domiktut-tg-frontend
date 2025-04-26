import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, Input } from '@angular/core';
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
  @Input() houses$!: Observable<House[]>;

  track(index: number, item: House) {
    return item.post_id;
  }
}
