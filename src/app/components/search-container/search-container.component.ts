import { AsyncPipe, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { DataStoreService } from '../../services/data-store.service';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, Observable, startWith, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { House } from '../../interfaces/house.interface';

const type_houses = [
  {
    'id': 1,
    'title': 'Уникальное жилье',
    'isChecked': false
  },
  {
    'id': 2,
    'title': 'Деревянный/Шале',
    'isChecked': false
  },
  {
    'id': 3,
    'title': 'Вилла',
    'isChecked': false
  },
  {
    'id': 4,
    'title': 'Таунхаус',
    'isChecked': false
  },
  {
    'id': 5,
    'title': 'Лофт',
    'isChecked': false
  },
  {
    'id': 6,
    'title': 'Коттедж',
    'isChecked': false
  },
]

@Component({
  selector: 'app-search-container',
  imports: [NgIf, ReactiveFormsModule, MatAutocompleteModule, AsyncPipe],
  templateUrl: './search-container.component.html',
  styleUrl: './search-container.component.scss'
})
export class SearchContainerComponent implements OnInit {
  @Output() closeSearchContainer = new EventEmitter<void>;

  type_houses = type_houses;

  formFilters: FormGroup;

  searchInputControl = new FormControl('');

  houses$!: Observable<House[]>;
  filteredHouses$!: Observable<House[]>;

  get formFiltersConrols() {
    return this.formFilters.controls;
  }

  constructor(private builder: FormBuilder,
    private wordpressIntegrationService: WordpressIntegrationService,
    private dataStoreService: DataStoreService
  ) {
    this.formFilters = this.builder.group({
      date_of_arrival: [null, [Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}$')]],
      date_of_departure: [null, [Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}$')]],
      number_of_people: [null, [Validators.min(0), Validators.max(1000)]],
      number_of_bedrooms: [null, [Validators.min(0), Validators.max(1000)]],
      number_of_beds: [null, [Validators.min(0), Validators.max(1000)]],
      min_price: [0, [Validators.min(0), Validators.max(1000000)]],
      max_price: [null, [Validators.min(0), Validators.max(1000000)]],
      // type_of_house: new FormArray([])
    });
  }

  ngOnInit() {
    this.houses$ = this.dataStoreService.houses$;

    this.filteredHouses$ = this.searchInputControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''),
      switchMap((value) => {
        const filterValue = this._normalizeValue(value || '');
        return this.houses$.pipe(
          map(val => val.filter(v => this._normalizeValue(v.house_name || '').includes(filterValue)))
        )
      })
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  onCheckChange(event: any) {
    const formArray: FormArray = this.formFilters.get('typeHouses') as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    }
    /* unselected */
    else {
      // find the unselected element
      let i = 0;

      formArray.controls.forEach((ctrl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }

  sumbitForm() {
    console.log('formFilters', this.formFilters.value)
    this.wordpressIntegrationService.getHousesByFilter(this.formFilters.value).subscribe(data => {
      this.dataStoreService.setHouses(data);
    });
  }

  clearForm() {
    this.dataStoreService.updatedMainStore();
    this.formFilters.reset();
  }

  close() {
    this.closeSearchContainer.emit();
  }
}
