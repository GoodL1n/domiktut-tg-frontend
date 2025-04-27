import { AsyncPipe, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { DataStoreService } from '../../services/data-store.service';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, Observable, startWith, switchMap, take } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { House } from '../../interfaces/house.interface';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { SearchStartComponent } from "../search-start/search-start.component";

@Component({
  selector: 'app-search-container',
  imports: [NgIf, ReactiveFormsModule, RouterLink, MatAutocompleteModule, AsyncPipe, HeaderComponent, SearchStartComponent],
  templateUrl: './search-container.component.html',
  styleUrl: './search-container.component.scss'
})
export class SearchContainerComponent implements OnInit {
  @Output() closeSearchContainer = new EventEmitter<void>;
  
  isFilters: boolean = false;
  isSearchInput: boolean = false;

  formFilters: FormGroup;

  searchInputControl = new FormControl('');

  houses$!: Observable<House[]>;
  filteredHouses$!: Observable<House[]>;

  get formFiltersConrols() {
    return this.formFilters.controls;
  }

  constructor(private builder: FormBuilder,
    private wordpressIntegrationService: WordpressIntegrationService,
    private dataStoreService: DataStoreService,
    private router: Router
  ) {
    this.formFilters = this.builder.group({
      date_of_arrival: [null, [Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}$')]],
      date_of_departure: [null, [Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}$')]],
      number_of_people: [null, [Validators.min(0), Validators.max(1000)]],
    });
  }

  ngOnInit() {
    this.houses$ = this.dataStoreService.houses$;

    this.filteredHouses$ = this.searchInputControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''),
      switchMap((value) => {
        console.log('222')
        const filterValue = this.normalizeValue(value || '');
        return this.houses$.pipe(
          map(val => val.filter(v => this.normalizeValue(v.house_name || '').includes(filterValue)))
        )
      })
    );
  }

  
  normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  applySearchInput() {
    console.log(123)
    // this.filteredHouses$.pipe(take(1)).subscribe(data => { console.log(data); this.dataStoreService.setHouses(data) });
  }

  sumbitForm() {
    console.log('formFilters', this.formFilters.value)
    // this.wordpressIntegrationService.getHousesByFilter(this.formFilters.value).subscribe(data => {
    //   this.dataStoreService.setHouses(data);
    // });
  }

  clearForm() {
    // this.dataStoreService.updatedMainStore();
    this.formFilters.reset();
  }

  closeContainer(){
    this.closeSearchContainer.emit();
  }
}
