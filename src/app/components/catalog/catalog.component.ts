import { Component, OnInit } from '@angular/core';
import { MiniCardComponent } from "../mini-card/mini-card.component";
import { NgFor } from '@angular/common';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { House } from '../../interfaces/house.interface';
import { testData } from '../../test-data';

@Component({
  selector: 'app-catalog',
  imports: [MiniCardComponent, NgFor, 
    // AsyncPipe
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  providers: [WordpressIntegrationService]
})
export class CatalogComponent implements OnInit {

  // houses$!: Observable<House[]>;

  houses: House[] = testData;

  // constructor(private wordpressIntegrationService: WordpressIntegrationService) { }

  ngOnInit() {
    console.log(this.houses);
    // this.houses$ = this.wordpressIntegrationService.get3Posts();
  }

  // objects = [
  //   {
  //     name: 'Нагорный ВИП',
  //     geo: 'Советский район',
  //     price: 'от 45 000 р'
  //   },
  //   {
  //     name: 'Нагорный Рыцарский',
  //     geo: 'Советский район',
  //     price: 'от 17 000 р'
  //   },
  //   {
  //     name: 'Нагорный ВИП',
  //     geo: 'Советский район',
  //     price: 'от 14 000 р'
  //   }
  // ]
}
