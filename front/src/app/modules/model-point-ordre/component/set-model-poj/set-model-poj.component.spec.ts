import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetModelPojComponent } from './set-model-poj.component';

describe('SetModelPojComponent', () => {
  let component: SetModelPojComponent;
  let fixture: ComponentFixture<SetModelPojComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetModelPojComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetModelPojComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
