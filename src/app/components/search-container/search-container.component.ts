import { AsyncPipe, NgIf } from '@angular/common';
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
  imports: [NgIf, ReactiveFormsModule, RouterLink, MatAutocompleteModule, AsyncPipe, HeaderComponent, SearchStartComponent],
  templateUrl: './search-container.component.html',
  styleUrl: './search-container.component.scss'
})
export class SearchContainerComponent implements OnInit {
  @Output() closeSearchContainer = new EventEmitter<void>;
  @Input() isOpenFromMainPage: boolean = false;

  formFilters: FormGroup;

  searchInputControl = new FormControl('');

  houses$!: Observable<House[]>;
  filteredHouses$!: Observable<House[]>;

  _destroy: DestroyRef = inject(DestroyRef);

  get formFiltersConrols() {
    return this.formFilters.controls;
  }

  constructor(private builder: FormBuilder,
    private wordpressIntegrationService: WordpressIntegrationService,
    private dataStoreService: DataStoreService,
    private router: Router
  ) {
    this.formFilters = this.builder.group({
      date_of_arrival: [null, [Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}\.{1}[0-9]{4}$')]],
      date_of_departure: [null, [Validators.pattern('^[0-9]{2}\.{1}[0-9]{2}\.{1}[0-9]{4}$')]],
      number_of_people: [null, [Validators.min(0), Validators.max(1000)]],
    });
  }

  ngOnInit() {
    this.filteredHouses$ = this.searchInputControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''),
      switchMap((value) => {
        const filterValue = this.normalizeValue(value || '');
        return this.dataStoreService.allHouses$.pipe(
          map(val => val.filter(v => this.normalizeValue(v.house_name || '').includes(filterValue))),
          takeUntilDestroyed(this._destroy)
        )
      }),
      takeUntilDestroyed(this._destroy)
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
    console.log('search container', this.formFilters.value);
    if (this.formFilters.value.date_of_arrival && this.formFilters.value.date_of_departure) {
      this.wordpressIntegrationService.getHousesIdByDate(this.formFilters.value.date_of_arrival, this.formFilters.value.date_of_departure)
        .pipe(
          tap(data => console.log('id после фильтрации', data)),
          concatMap((data) => this.dataStoreService.houses$
            .pipe(
              map(houses => {
                return houses.filter(house => !!data.find(id => Number(id) === house.post_id));
              })
            )),
          takeUntilDestroyed(this._destroy)
        )
        .subscribe(data => this.dataStoreService.setHouses(data));
    }
    if (this.formFilters.value.number_of_people) {
      this.dataStoreService.houses$
        .pipe(
          map(houses => {
            return houses.filter(house => Number(house.number_of_people) >= this.formFilters.value.number_of_people);
          })
          ,
          takeUntilDestroyed(this._destroy)
        )
        .subscribe(data => this.dataStoreService.setHouses(data));
    }
    if (this.isOpenFromMainPage) {
      this.router.navigate(['/catalog']);
    }
  }

  clearForm() {
    this.dataStoreService.updatedMainStore();
    this.formFilters.reset();
  }

  closeContainer() {
    this.closeSearchContainer.emit();
  }
}
