import { NgIf, NgStyle, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';

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
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './search-container.component.html',
  styleUrl: './search-container.component.scss'
})
export class SearchContainerComponent {
  isFilterBlock = false;

  formFilters: FormGroup;

  type_houses = type_houses;

  constructor(private builder: FormBuilder) {
    this.formFilters = this.builder.group({
      dateOfArrival: '',
      dateOfDeparture: '',
      numberOfPeople: '',
      numberOfBedrooms: '',
      numberOfBeds: '',
      minPrice: '',
      maxPrice: '',
      typeHouses: new FormArray([])
    });
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
      let i  = 0;

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

  filterBlockOpen() {
    this.isFilterBlock = !this.isFilterBlock;
  }

  sumbitForm() {
    console.log(this.formFilters)
  }

  clearForm() {
    this.formFilters.reset(

    );
  }
}
