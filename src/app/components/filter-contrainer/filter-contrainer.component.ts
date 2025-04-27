import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-filter-contrainer',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './filter-contrainer.component.html',
  styleUrl: './filter-contrainer.component.scss'
})
export class FilterContrainerComponent {
  @Output() closeFilterContainer = new EventEmitter<void>;

  formFilters: FormGroup;

  get formFiltersConrols() {
    return this.formFilters.controls;
  }

  constructor(private builder: FormBuilder) {
    this.formFilters = this.builder.group({
      number_of_people: [null, [Validators.min(0), Validators.max(1000)]],
      number_of_bedrooms: [null, [Validators.min(0), Validators.max(1000)]],
      number_of_beds: [null, [Validators.min(0), Validators.max(1000)]],
    });
  }
}
