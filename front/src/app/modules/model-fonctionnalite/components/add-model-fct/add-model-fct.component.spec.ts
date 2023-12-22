import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModelFctComponent } from './add-model-fct.component';

describe('AddModelFctComponent', () => {
  let component: AddModelFctComponent;
  let fixture: ComponentFixture<AddModelFctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModelFctComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModelFctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
