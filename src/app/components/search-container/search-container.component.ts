import { NgIf, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-container',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './search-container.component.html',
  styleUrl: './search-container.component.scss'
})
export class SearchContainerComponent {
  isFilterBlock = false;

  formFilters: FormGroup;

  constructor(private builder: FormBuilder){
    this.formFilters = this.builder.group({
      dateOfArrival: '',
      dateOfDeparture: '',
      quanitityOfPeople: '',
      minPrice: '',
      maxPrice: ''
    })
  }

  filterBlockOpen() {
    this.isFilterBlock = !this.isFilterBlock;
  }

  sumbitForm(){
    console.log(this.formFilters)
  }

  clearForm(){
    this.formFilters.reset(

    );
  }
}
