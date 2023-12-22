import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUserLogsComponent } from './list-user-logs.component';

describe('ListUserLogsComponent', () => {
  let component: ListUserLogsComponent;
  let fixture: ComponentFixture<ListUserLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListUserLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListUserLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
