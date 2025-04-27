import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterContrainerComponent } from './filter-contrainer.component';

describe('FilterContrainerComponent', () => {
  let component: FilterContrainerComponent;
  let fixture: ComponentFixture<FilterContrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterContrainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterContrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
