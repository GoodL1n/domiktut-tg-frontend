import { Component, OnDestroy, OnInit } from '@angular/core';
import { hideBackButton, mountBackButton, onBackButtonClick, onMainButtonClick, setMainButtonParams, showBackButton, unmountBackButton } from '@telegram-apps/sdk';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataStoreService } from '../../services/data-store.service';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { House } from '../../interfaces/house.interface';
import { MiniCardComponent } from "../../components/mini-card/mini-card.component";
import { AsyncPipe, NgIf } from '@angular/common';
import { TelegramService } from '../../services/telegram.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-request',
  imports: [ReactiveFormsModule, MiniCardComponent, NgIf, AsyncPipe],
  templateUrl: './form-request.component.html',
  styleUrl: './form-request.component.scss'
})
export class FormRequestComponent implements OnInit, OnDestroy {

  house!: Observable<House>;
  formRequest: FormGroup;

  destroySubscription = new BehaviorSubject(true);

  constructor(private builder: FormBuilder,
    private router: Router,
    private dataStoreService: DataStoreService,
    private tgSerice: TelegramService) {

    this.house = this.dataStoreService.currentHouse$.pipe(
      filter(house => Object.keys(house).length > 0)
    );

    this.formRequest = this.builder.group({
      dateOfArrival: [null, [Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}$')]],
      dateOfDeparture: [null, [Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}$')]],
      quanitityOfPeople: [null, [Validators.min(0), Validators.max(1000)]],
      name: [null, [Validators.required, Validators.pattern('[А-Яа-я]+')]],
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

  sumbitForm() {
    const data = JSON.stringify(this.formRequest.value);

    this.dataStoreService.setCurrentHouse({});
    this.dataStoreService.setCurrentHouseId(0);

    this.tgSerice.sendMessage(data).subscribe((data) => {
      console.log(data)
      this.router.navigate(['../request-success']);
    })
  }

  clearForm() {
    this.formRequest.reset();
  }

  ngOnDestroy(): void {
    this.destroySubscription.next(true);
    this.destroySubscription.complete();

    hideBackButton();

    unmountBackButton();
  }
}
