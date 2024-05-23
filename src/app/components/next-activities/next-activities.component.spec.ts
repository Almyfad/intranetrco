import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextActivitiesComponent } from './next-activities.component';

describe('NextActivitiesComponent', () => {
  let component: NextActivitiesComponent;
  let fixture: ComponentFixture<NextActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextActivitiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NextActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
