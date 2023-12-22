import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTypeOrganeComponent } from './edit-type-organe.component';

describe('EditTypeOrganeComponent', () => {
  let component: EditTypeOrganeComponent;
  let fixture: ComponentFixture<EditTypeOrganeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTypeOrganeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTypeOrganeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
