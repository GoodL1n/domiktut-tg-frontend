import { Component, Input } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-loader',
  imports: [NgIf],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService){}
}
