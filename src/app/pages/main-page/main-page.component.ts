import { Component } from '@angular/core';
import { SearchContainerComponent } from "../../components/search-container/search-container.component";
import { CatalogComponent } from "../../components/catalog/catalog.component";

@Component({
  selector: 'app-main-page',
  imports: [SearchContainerComponent, CatalogComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
