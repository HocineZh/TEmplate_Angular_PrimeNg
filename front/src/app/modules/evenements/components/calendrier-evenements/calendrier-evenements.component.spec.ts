import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendrierEvenementsComponent } from './calendrier-evenements.component';

describe('CalendrierEvenementsComponent', () => {
  let component: CalendrierEvenementsComponent;
  let fixture: ComponentFixture<CalendrierEvenementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendrierEvenementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendrierEvenementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
