import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, DestroyRef, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { WordpressIntegrationService } from '../../services/wordpress-integration.service';
import { DataStoreService } from '../../services/data-store.service';
import { concatMap, debounceTime, distinctUntilChanged, filter, fromEvent, map, Observable, startWith, switchMap, take, tap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { House } from '../../interfaces/house.interface';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { SearchStartComponent } from "../search-start/search-start.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-container',
  imports: [NgIf, NgClass, ReactiveFormsModule, RouterLink, MatAutocompleteModule, AsyncPipe, HeaderComponent, SearchStartComponent],
  templateUrl: './search-container.component.html',
  styleUrl: './search-container.component.scss'
})
export class SearchContainerComponent implements OnInit {
  @Output() closeSearchContainer = new EventEmitter<void>;
  @Input() isOpenFromMainPage: boolean = false;

  formFilters!: FormGroup;

  searchInputControl = new FormControl('');

  filteredHouses: House[] = [];
  filteredHouses$!: Observable<House[]>;

  _destroy: DestroyRef = inject(DestroyRef);

  get formFiltersConrols() {
    return this.formFilters.controls;
  }

  constructor(private builder: FormBuilder,
    private wordpressIntegrationService: WordpressIntegrationService,
    private dataStoreService: DataStoreService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dataStoreService.filter$.pipe(
      take(1)
    ).subscribe(currentFilters => {
      this.formFilters = this.builder.group({
        date_of_arrival: [currentFilters.dateOfArrival ?? null, [Validators.required, Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}\.{1}[0-9]{4}$')]],
        date_of_departure: [currentFilters.dateOfDeparture ?? null, [Validators.required, Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}\.{1}[0-9]{4}$')]],
        number_of_people: [currentFilters.numberOfPeople ?? null, [Validators.min(0), Validators.max(1000)]],
      });
    })

    this.filteredHouses$ = this.searchInputControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''),
      switchMap((value) => {
        const filterValue = this.normalizeValue(value || '');
        return this.dataStoreService.allHouses$.pipe(
          map(val => {
            const houses = val.filter(v => this.normalizeValue(v.house_name || '').includes(filterValue));
            this.filteredHouses = houses;
            return houses;
          }),
          takeUntilDestroyed(this._destroy)
        )
      }),
      takeUntilDestroyed(this._destroy)
    );
  }


  normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  sumbitForm() {
    console.log('search container', this.formFilters.value);

    if (this.formFilters.value.date_of_arrival && this.formFilters.value.date_of_departure) {
      this.wordpressIntegrationService.getHousesIdByDate(this.formFilters.value.date_of_arrival, this.formFilters.value.date_of_departure)
        .pipe(
          concatMap((arrayId) => this.dataStoreService.filter$
            .pipe(
              map(filter => {
                let postIdFilteredByName = this.filteredHouses.map(el => el.post_id!);
                return {
                  ...filter,
                  postIdFilteredByDate: arrayId,
                  postIdFilteredByName: postIdFilteredByName,
                  numberOfPeople: this.formFilters.value.number_of_people,
                  dateOfArrival: this.formFilters.value.date_of_arrival,
                  dateOfDeparture: this.formFilters.value.date_of_departure
                };
              })
            )),
          take(1)
        )
        .subscribe(data => {
          this.dataStoreService.setFilter(data);

          if (this.isOpenFromMainPage) {
            this.router.navigate(['/catalog']);
          }

          this.closeContainer();
        });

    } else {
      this.dataStoreService.filter$.pipe(
        take(1)
      ).subscribe(currentFilters => {
        let postIdFilteredByName = this.filteredHouses.map(el => el.post_id!);

        this.dataStoreService.setFilter({
          ...currentFilters,
          postIdFilteredByName: postIdFilteredByName,
          numberOfPeople: this.formFilters.value.number_of_people
        });

        if (this.isOpenFromMainPage) {
          this.router.navigate(['/catalog']);
        }

        this.closeContainer();
      })
    }
  }

  clearForm() {
    this.dataStoreService.filter$.pipe(
      take(1)
    ).subscribe(currentFilters => {
      let filters = currentFilters;

      delete filters.postIdFilteredByDate;
      delete filters.postIdFilteredByName;
      delete filters.numberOfPeople;

      this.dataStoreService.setFilter(filters);
    })

    this.formFilters.reset();
  }

  closeContainer() {
    this.closeSearchContainer.emit();
  }
}
