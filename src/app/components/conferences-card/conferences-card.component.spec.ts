import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferencesCardComponent } from './conferences-card.component';

describe('ConferencesCardComponent', () => {
  let component: ConferencesCardComponent;
  let fixture: ComponentFixture<ConferencesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferencesCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConferencesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
