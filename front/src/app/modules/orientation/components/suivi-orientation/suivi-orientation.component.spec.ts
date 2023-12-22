import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviOrientationComponent } from './suivi-orientation.component';

describe('SuiviOrientationComponent', () => {
  let component: SuiviOrientationComponent;
  let fixture: ComponentFixture<SuiviOrientationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuiviOrientationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviOrientationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
