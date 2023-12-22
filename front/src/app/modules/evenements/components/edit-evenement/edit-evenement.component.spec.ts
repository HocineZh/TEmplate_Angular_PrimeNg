import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEvenementComponent } from './edit-evenement.component';

describe('DetailsEvenementComponent', () => {
  let component: EditEvenementComponent;
  let fixture: ComponentFixture<EditEvenementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEvenementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEvenementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
