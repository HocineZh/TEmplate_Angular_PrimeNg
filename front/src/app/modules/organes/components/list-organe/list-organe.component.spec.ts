import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrganeComponent } from './list-organe.component';

describe('ListOrganeComponent', () => {
  let component: ListOrganeComponent;
  let fixture: ComponentFixture<ListOrganeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOrganeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOrganeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
