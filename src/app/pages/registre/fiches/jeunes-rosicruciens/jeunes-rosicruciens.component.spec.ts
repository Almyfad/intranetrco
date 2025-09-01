import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeunesRosicruciensComponent } from './jeunes-rosicruciens.component';

describe('JeunesRosicruciensComponent', () => {
  let component: JeunesRosicruciensComponent;
  let fixture: ComponentFixture<JeunesRosicruciensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JeunesRosicruciensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeunesRosicruciensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
