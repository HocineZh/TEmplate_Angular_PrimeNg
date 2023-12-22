import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModelPojComponent } from './add-model-poj.component';

describe('AddModelPojComponent', () => {
  let component: AddModelPojComponent;
  let fixture: ComponentFixture<AddModelPojComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModelPojComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModelPojComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
