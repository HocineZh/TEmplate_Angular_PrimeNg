import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModelProcessComponent } from './add-model-process.component';

describe('AddModelProcessComponent', () => {
  let component: AddModelProcessComponent;
  let fixture: ComponentFixture<AddModelProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModelProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModelProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
