import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-request-success',
  imports: [HeaderComponent],
  templateUrl: './request-success.component.html',
  styleUrl: './request-success.component.scss'
})
export class RequestSuccessComponent {
  constructor(private router: Router) { }

  route() {
    this.router.navigate(['']);
  }
}
