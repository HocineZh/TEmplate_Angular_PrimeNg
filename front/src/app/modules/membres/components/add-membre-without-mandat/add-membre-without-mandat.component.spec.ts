import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMembreWithoutMandatComponent } from './add-membre-without-mandat.component';

describe('AddMembreWithoutMandatComponent', () => {
  let component: AddMembreWithoutMandatComponent;
  let fixture: ComponentFixture<AddMembreWithoutMandatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMembreWithoutMandatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMembreWithoutMandatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
