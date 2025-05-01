import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnershipPageComponent } from './partnership-page.component';

describe('PartnershipPageComponent', () => {
  let component: PartnershipPageComponent;
  let fixture: ComponentFixture<PartnershipPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnershipPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnershipPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
