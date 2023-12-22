import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrientationComponent } from './add-orientation.component';

describe('AddOrientationComponent', () => {
  let component: AddOrientationComponent;
  let fixture: ComponentFixture<AddOrientationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrientationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrientationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
