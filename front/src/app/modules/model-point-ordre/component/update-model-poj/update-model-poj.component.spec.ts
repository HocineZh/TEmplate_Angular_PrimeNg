import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModelPojComponent } from './update-model-poj.component';

describe('UpdateModelPojComponent', () => {
  let component: UpdateModelPojComponent;
  let fixture: ComponentFixture<UpdateModelPojComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModelPojComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateModelPojComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
