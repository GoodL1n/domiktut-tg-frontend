import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { hideBackButton, mountBackButton, mountMainButton, onBackButtonClick, onMainButtonClick, setMainButtonParams, showBackButton, unmountBackButton } from '@telegram-apps/sdk';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataStoreService } from '../../services/data-store.service';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { House } from '../../interfaces/house.interface';
import { MiniCardComponent } from "../../components/mini-card/mini-card.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-form-request',
  imports: [ReactiveFormsModule, MiniCardComponent, NgIf],
  templateUrl: './form-request.component.html',
  styleUrl: './form-request.component.scss'
})
export class FormRequestComponent implements OnInit, OnDestroy {

  house: House | undefined = undefined;
  formRequest: FormGroup;

  destroySubscription = new BehaviorSubject(true);

  constructor(private builder: FormBuilder,
    private router: Router,
    private dataStoreService: DataStoreService) {
    this.dataStoreService.currentHouse$.pipe(takeUntil(this.destroySubscription)).subscribe(data => {
      if (data && Object.keys(data).length > 0) {
        this.house = data;
      }
    });

    this.formRequest = this.builder.group({
      dateOfArrival: [null, [Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}$')]],
      dateOfDeparture: [null, [Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}$')]],
      quanitityOfPeople: [null, [Validators.min(0), Validators.max(1000)]],
      name: [null, [Validators.required, Validators.pattern('[A-Za-z]+')]],
      phone: [7, [Validators.pattern('[0-9]{1}[0-9]{3}[0-9]{3}[0-9]{4}')]],
      telegram: ['@', [Validators.pattern('@.+')]],
    })
  }

  get formRequestControl() {
    return this.formRequest.controls;
  }

  ngOnInit(): void {
    mountBackButton.ifAvailable();
    showBackButton();
    onBackButtonClick(() => this.router.navigate(['card']));
  }

  ngOnDestroy(): void {
    console.log('удаляем form', this.destroySubscription);
    this.destroySubscription.next(true);
    this.destroySubscription.complete();
    console.log('удалили form', this.destroySubscription);

    hideBackButton();

    unmountBackButton();
  }

  sumbitForm() {
    console.log(this.formRequest)
  }

  clearForm() {
    this.formRequest.reset();
  }
}
