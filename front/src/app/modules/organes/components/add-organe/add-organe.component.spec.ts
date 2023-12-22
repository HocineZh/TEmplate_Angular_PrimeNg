import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrganeComponent } from './add-organe.component';

describe('AddOrganeComponent', () => {
  let component: AddOrganeComponent;
  let fixture: ComponentFixture<AddOrganeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrganeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrganeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
