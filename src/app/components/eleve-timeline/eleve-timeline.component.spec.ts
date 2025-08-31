import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleveTimelineComponent } from './eleve-timeline.component';

describe('EleveTimelineComponent', () => {
  let component: EleveTimelineComponent;
  let fixture: ComponentFixture<EleveTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EleveTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EleveTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
