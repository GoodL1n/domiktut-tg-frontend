import { Component } from '@angular/core';
import { SearchContainerComponent } from "../../components/search-container/search-container.component";
import { CatalogComponent } from "../../components/catalog/catalog.component";
import { AsyncPipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LoaderComponent } from '../../components/loader/loader.component';
import { LoaderService } from '../../services/loader.service';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';

@Component({
  selector: 'app-main-page',
  imports: [NgIf, SearchContainerComponent, CatalogComponent, ScrollingModule, LoaderComponent, AsyncPipe],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  isFilterBlock = false;

  constructor(private router: Router, public loaderService: LoaderService) { }

  changeStatusFilterBlock() {
    this.isFilterBlock = !this.isFilterBlock;
  }

  routerToRequest() {
    this.router.navigate(['form-request']);
  }
}
