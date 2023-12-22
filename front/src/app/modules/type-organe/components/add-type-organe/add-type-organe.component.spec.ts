import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeOrganeComponent } from './add-type-organe.component';

describe('AddTypeOrganeComponent', () => {
  let component: AddTypeOrganeComponent;
  let fixture: ComponentFixture<AddTypeOrganeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTypeOrganeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTypeOrganeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
