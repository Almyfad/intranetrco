import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeunessesComponent } from './jeunesses.component';

describe('JeunessesComponent', () => {
  let component: JeunessesComponent;
  let fixture: ComponentFixture<JeunessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JeunessesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeunessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
