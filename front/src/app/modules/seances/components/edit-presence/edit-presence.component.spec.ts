import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPresenceComponent } from './edit-presence.component';

describe('EditPresenceComponent', () => {
  let component: EditPresenceComponent;
  let fixture: ComponentFixture<EditPresenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPresenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
