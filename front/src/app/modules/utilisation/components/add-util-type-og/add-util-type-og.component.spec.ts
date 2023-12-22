import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUtilTypeOgComponent } from './add-util-type-og.component';

describe('AddUtilTypeOgComponent', () => {
  let component: AddUtilTypeOgComponent;
  let fixture: ComponentFixture<AddUtilTypeOgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUtilTypeOgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUtilTypeOgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
