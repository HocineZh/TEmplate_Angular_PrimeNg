import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocationModelComponent } from './convocation-model.component';

describe('ConvocationModelComponent', () => {
  let component: ConvocationModelComponent;
  let fixture: ComponentFixture<ConvocationModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvocationModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvocationModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
