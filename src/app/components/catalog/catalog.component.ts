import { Component } from '@angular/core';
import { MiniCardComponent } from "../mini-card/mini-card.component";
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-catalog',
  imports: [MiniCardComponent, NgFor],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {
  objects = [
    {
      name: 'Нагорный ВИП',
      geo: 'Советский район',
      price: 'от 45 000 р'
    },
    {
      name: 'Нагорный Рыцарский',
      geo: 'Советский район',
      price: 'от 17 000 р'
    },
    {
      name: 'Нагорный ВИП',
      geo: 'Советский район',
      price: 'от 14 000 р'
    }
  ]
}
