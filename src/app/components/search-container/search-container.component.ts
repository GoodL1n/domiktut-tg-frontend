import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-search-container',
  imports: [NgIf],
  templateUrl: './search-container.component.html',
  styleUrl: './search-container.component.scss'
})
export class SearchContainerComponent {
  isFilterBlock = false;

  filterBlockOpen() {
    this.isFilterBlock = !this.isFilterBlock;
  }
}
