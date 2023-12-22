import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMembreComponent } from './add-membre.component';

describe('AddMembreComponent', () => {
  let component: AddMembreComponent;
  let fixture: ComponentFixture<AddMembreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMembreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMembreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
