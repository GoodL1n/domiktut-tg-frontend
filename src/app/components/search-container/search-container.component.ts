import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { DataStoreService } from '../../services/data-store.service';

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
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './search-container.component.html',
  styleUrl: './search-container.component.scss'
})
export class SearchContainerComponent {
  @Output() closeSearchContainer = new EventEmitter<void>;

  formFilters: FormGroup;

  type_houses = type_houses;

  constructor(private builder: FormBuilder,
    private wordpressIntegrationService: WordpressIntegrationService,
    private dataStoreService: DataStoreService
  ) {
    this.formFilters = this.builder.group({
      dateOfArrival: [null, [Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}$')]],
      dateOfDeparture: [null, [Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}$')]],
      number_of_people: [null, [Validators.min(0), Validators.max(1000)]],
      number_of_bedrooms: [null, [Validators.min(0), Validators.max(1000)]],
      number_of_beds: [null, [Validators.min(0), Validators.max(1000)]],
      minPrice: [{ value: null, disabled: true }, [Validators.min(0), Validators.max(1000000)]],
      maxPrice: [{ value: null, disabled: true }, [Validators.min(0), Validators.max(1000000)]],
      // type_of_house: new FormArray([])
    });
  }

  get formFiltersConrols() {
    return this.formFilters.controls;
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
