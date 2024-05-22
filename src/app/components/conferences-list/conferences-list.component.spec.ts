import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferencesListComponent } from './conferences-list.component';

describe('ConferencesListComponent', () => {
  let component: ConferencesListComponent;
  let fixture: ComponentFixture<ConferencesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferencesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConferencesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
