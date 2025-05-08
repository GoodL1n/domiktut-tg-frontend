import { NgIf } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataStoreService } from '../../services/data-store.service';
import { map, take, takeWhile } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { House } from '../../interfaces/house.interface';

@Component({
  selector: 'app-filter-contrainer',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './filter-contrainer.component.html',
  styleUrl: './filter-contrainer.component.scss'
})
export class FilterContrainerComponent {
  @Output() closeFilterContainer = new EventEmitter<void>;

  formFilters: FormGroup;

  _destroy: DestroyRef = inject(DestroyRef);

  get formFiltersConrols() {
    return this.formFilters.controls;
  }

  constructor(private builder: FormBuilder,
    private dataStoreService: DataStoreService) {
    this.formFilters = this.builder.group({
      numberOfBedrooms: [null, [Validators.min(0), Validators.max(1000)]],
      numberOfBeds: [null, [Validators.min(0), Validators.max(1000)]],
      isPool: [null]
    });
  }

  submitForm() {
    console.log('filters', this.formFilters.value);

    this.dataStoreService.filter$.pipe(
      take(1)
    ).subscribe(currentFilters => {
      this.dataStoreService.setFilter({ ...currentFilters, ...this.formFilters.value });
    })
  }

  clearForm() {

    this.dataStoreService.filter$.pipe(
      take(1)
    ).subscribe(currentFilters => {
      let filters = currentFilters;

      delete filters.numberOfBedrooms;
      delete filters.numberOfBeds;
      delete filters.isPool;

      this.dataStoreService.setFilter(filters);
    })

    this.formFilters.reset();
  }
}
