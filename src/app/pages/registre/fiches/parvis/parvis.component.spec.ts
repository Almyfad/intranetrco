import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParvisComponent } from './parvis.component';

describe('ParvisComponent', () => {
  let component: ParvisComponent;
  let fixture: ComponentFixture<ParvisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParvisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParvisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
