import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModelOjComponent } from './update-model-oj.component';

describe('UpdateModelOjComponent', () => {
  let component: UpdateModelOjComponent;
  let fixture: ComponentFixture<UpdateModelOjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModelOjComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateModelOjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
