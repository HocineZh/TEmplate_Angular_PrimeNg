import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModelOjComponent } from './view-model-oj.component';

describe('ViewModelOjComponent', () => {
  let component: ViewModelOjComponent;
  let fixture: ComponentFixture<ViewModelOjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewModelOjComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewModelOjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
