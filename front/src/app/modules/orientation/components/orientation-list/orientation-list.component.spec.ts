import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrientationListComponent } from './orientation-list.component';

describe('OrientationListComponent', () => {
  let component: OrientationListComponent;
  let fixture: ComponentFixture<OrientationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrientationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrientationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
