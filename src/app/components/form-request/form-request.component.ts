import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { hideBackButton, mountBackButton, onBackButtonClick, onMainButtonClick, setMainButtonParams, showBackButton, unmountBackButton } from '@telegram-apps/sdk';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataStoreService } from '../../services/data-store.service';
import { BehaviorSubject, concatMap, filter, map, Observable, switchMap, take, takeUntil, tap } from 'rxjs';
import { House } from '../../interfaces/house.interface';
import { MiniCardComponent } from "../mini-card/mini-card.component";
import { AsyncPipe, NgIf } from '@angular/common';
import { TelegramService } from '../../services/telegram.service';
import { Router } from '@angular/router';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';

@Component({
  selector: 'app-form-request',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './form-request.component.html',
  styleUrl: './form-request.component.scss'
})
export class FormRequestComponent implements OnInit, OnDestroy {

  @Output() closeForm = new EventEmitter<void>;

  house$!: Observable<House>;
  house!: House;
  img: string = '';

  formRequest: FormGroup;

  destroySubscription = new BehaviorSubject(true);

  constructor(private builder: FormBuilder,
    private router: Router,
    private dataStoreService: DataStoreService,
    private tgSerice: TelegramService,
    private wordpressIntegrationService: WordpressIntegrationService) {

    this.formRequest = this.builder.group({
      dateOfArrival: [null, [Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}\.{1}[0-9]{4}$')]],
      dateOfDeparture: [null, [Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}\.{1}[0-9]{4}$')]],
      quanitityOfPeople: [null, [Validators.min(0), Validators.max(1000)]],
      name: [null, [Validators.required, Validators.pattern('[А-Яа-я]+')]],
      phone: [7, [Validators.pattern('[0-9]{1}[0-9]{3}[0-9]{3}[0-9]{4}')]],
      telegram: ['@', [Validators.pattern('@.+')]],
      description: [null]
    })
  }

  get formRequestControl() {
    return this.formRequest.controls;
  }

  ngOnInit(): void {
    this.dataStoreService.currentHouse$.pipe(
      filter(house => (house && Object.keys(house).length > 0)),
      concatMap(data =>
        this.dataStoreService.currentHouseImgs$.pipe(
          map(imgs => {
            return { data, imgs }
          })
        ))
    )
      .subscribe(({ data, imgs }) => {
        this.house = data;

        this.img = imgs[0];
      })
  }

  sumbitForm() {
    let form = this.formRequest.value;

    if (this.house) {
      form.house_name = this.house.house_name;
      form.adress = this.house.adress;
      form.post_id = this.house.post_id;
    }

    const data = JSON.stringify(form);

    this.dataStoreService.setCurrentHouse({});
    this.dataStoreService.setCurrentHouseId(0);

    this.tgSerice.sendMessage(data).subscribe((data) => {
      this.router.navigate(['/request-success']);
    })
  }

  clearForm() {
    this.formRequest.reset();
  }

  ngOnDestroy(): void {
    this.destroySubscription.next(true);
    this.destroySubscription.complete();
  }

  close() {
    this.closeForm.emit();
  }
}
