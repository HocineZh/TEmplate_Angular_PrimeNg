import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOdjComponent } from './edit-odj.component';

describe('EditOdjComponent', () => {
  let component: EditOdjComponent;
  let fixture: ComponentFixture<EditOdjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOdjComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOdjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
