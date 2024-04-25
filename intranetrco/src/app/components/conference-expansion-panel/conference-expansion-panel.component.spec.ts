import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceExpansionPanelComponent } from './conference-expansion-panel.component';

describe('ConferenceExpansionPanelComponent', () => {
  let component: ConferenceExpansionPanelComponent;
  let fixture: ComponentFixture<ConferenceExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceExpansionPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConferenceExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
