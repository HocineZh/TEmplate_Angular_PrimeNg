import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOrientationComponent } from './update-orientation.component';

describe('UpdateOrientationComponent', () => {
  let component: UpdateOrientationComponent;
  let fixture: ComponentFixture<UpdateOrientationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateOrientationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOrientationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
