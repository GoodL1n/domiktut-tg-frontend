import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchStartComponent } from './search-start.component';

describe('SearchStartComponent', () => {
  let component: SearchStartComponent;
  let fixture: ComponentFixture<SearchStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchStartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
