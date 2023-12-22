import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModelFctComponent } from './update-model-fct.component';

describe('UpdateModelFctComponent', () => {
  let component: UpdateModelFctComponent;
  let fixture: ComponentFixture<UpdateModelFctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModelFctComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateModelFctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
