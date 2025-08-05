import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesElevesComponent } from './fiches.eleves.component';

describe('FichesElevesComponent', () => {
  let component: FichesElevesComponent;
  let fixture: ComponentFixture<FichesElevesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichesElevesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FichesElevesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
