import { NgIf } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataStoreService } from '../../services/data-store.service';
import { map, takeWhile } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
      // number_of_people: [null, [Validators.min(0), Validators.max(1000)]],
      number_of_bedrooms: [null, [Validators.min(0), Validators.max(1000)]],
      number_of_beds: [null, [Validators.min(0), Validators.max(1000)]],
    });
  }

  submitForm() {
    console.log('filters', this.formFilters.value);

    this.dataStoreService.houses$.pipe(
      map(houses => {
        let filteredHouses = houses;
        if (this.formFilters.value.number_of_bedrooms && this.formFilters.value.number_of_beds) {
          filteredHouses = houses.filter(house =>
            (house.number_of_bedrooms && (house.number_of_bedrooms >= this.formFilters.value.number_of_bedrooms))
            && (house.number_of_beds && (house.number_of_beds >= this.formFilters.value.number_of_beds))
          )
        } else if (this.formFilters.value.number_of_bedrooms) {
          filteredHouses = houses.filter(house =>
            house.number_of_bedrooms && (house.number_of_bedrooms >= this.formFilters.value.number_of_bedrooms))
        } else if (this.formFilters.value.number_of_beds) {
          filteredHouses = houses.filter(house =>
            house.number_of_beds && (house.number_of_beds >= this.formFilters.value.number_of_beds))
        }
        return filteredHouses;
      }
      ),
      takeUntilDestroyed(this._destroy)
    ).subscribe()
  }

  clearForm() {
    this.formFilters.reset();
  }
}
