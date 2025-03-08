import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { hideBackButton, mountBackButton, mountMainButton, onBackButtonClick, onMainButtonClick, setMainButtonParams, showBackButton, unmountBackButton } from '@telegram-apps/sdk';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-request',
  imports: [ReactiveFormsModule],
  templateUrl: './form-request.component.html',
  styleUrl: './form-request.component.scss'
})
export class FormRequestComponent implements OnInit, OnDestroy {

  formFilters: FormGroup;

  constructor(private builder: FormBuilder, private router: Router) {
    this.formFilters = this.builder.group({
      dateOfArrival: '',
      dateOfDeparture: '',
      quanitityOfPeople: '',
      minPrice: '',
      maxPrice: ''
    })
  }

  ngOnInit(): void {
    mountBackButton.ifAvailable();
    showBackButton();
    onBackButtonClick(() => this.router.navigate(['card']));
  }

  ngOnDestroy(): void {
    hideBackButton();

    unmountBackButton();
  }

  sumbitForm() {
    console.log(this.formFilters)
  }

  clearForm() {
    this.formFilters.reset();
  }
}
