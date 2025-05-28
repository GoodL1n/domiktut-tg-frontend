import { NgIf } from '@angular/common';
import { Component, DestroyRef, ElementRef, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataStoreService } from '../../services/data-store.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-filter-contrainer',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './filter-contrainer.component.html',
  styleUrl: './filter-contrainer.component.scss'
})
export class FilterContrainerComponent {
  @Output() closeFilterContainer = new EventEmitter<void>;

  formFilters!: FormGroup;

  _destroy: DestroyRef = inject(DestroyRef);

  get formFiltersConrols() {
    return this.formFilters.controls;
  }

  @HostListener('document:click', ['$event'])
  clickOutComponent(event: Event){
    if(!this.elementRef.nativeElement.contains(event.target)){
      this.closeFilterContainer.emit();
    }
  }

  constructor(private builder: FormBuilder,
    private dataStoreService: DataStoreService,
    private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.dataStoreService.filter$.pipe(
      take(1)
    ).subscribe(currentFilters => {
      this.formFilters = this.builder.group({
        numberOfBedrooms: [currentFilters.numberOfBedrooms ?? null, [Validators.min(0), Validators.max(1000)]],
        numberOfBeds: [currentFilters.numberOfBeds ?? null, [Validators.min(0), Validators.max(1000)]],
        isPool: [currentFilters.isPool ?? null]
      });
    })
  }

  submitForm() {
    console.log('filters', this.formFilters.value);

    this.dataStoreService.filter$.pipe(
      take(1)
    ).subscribe(currentFilters => {
      this.dataStoreService.setFilter({ ...currentFilters, ...this.formFilters.value });
      this.closeFilterContainer.emit();
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
