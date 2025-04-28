import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-error-page',
  imports: [HeaderComponent],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss'
})
export class ErrorPageComponent {
  constructor(private router: Router){}

  route(){
    this.router.navigate(['']);
  }
}
