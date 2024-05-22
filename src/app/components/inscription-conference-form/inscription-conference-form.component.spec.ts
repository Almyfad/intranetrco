import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionConferenceFormComponent } from './inscription-conference-form.component';

describe('InscriptionConferenceFormComponent', () => {
  let component: InscriptionConferenceFormComponent;
  let fixture: ComponentFixture<InscriptionConferenceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscriptionConferenceFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InscriptionConferenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
