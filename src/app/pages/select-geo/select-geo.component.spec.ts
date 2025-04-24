import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGeoComponent } from './select-geo.component';

describe('SelectGeoComponent', () => {
  let component: SelectGeoComponent;
  let fixture: ComponentFixture<SelectGeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectGeoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectGeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
