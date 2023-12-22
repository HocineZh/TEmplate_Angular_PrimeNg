import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModelDelaiComponent } from './add-model-delai.component';

describe('AddModelDelaiComponent', () => {
  let component: AddModelDelaiComponent;
  let fixture: ComponentFixture<AddModelDelaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModelDelaiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModelDelaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
