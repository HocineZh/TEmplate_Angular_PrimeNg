import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPointOJComponent } from './add-point-oj.component';

describe('AddPointOJComponent', () => {
  let component: AddPointOJComponent;
  let fixture: ComponentFixture<AddPointOJComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPointOJComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPointOJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
