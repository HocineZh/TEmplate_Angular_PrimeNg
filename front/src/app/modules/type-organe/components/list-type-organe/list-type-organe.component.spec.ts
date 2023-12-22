import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTypeOrganeComponent } from './list-type-organe.component';

describe('ListTypeOrganeComponent', () => {
  let component: ListTypeOrganeComponent;
  let fixture: ComponentFixture<ListTypeOrganeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTypeOrganeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTypeOrganeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
