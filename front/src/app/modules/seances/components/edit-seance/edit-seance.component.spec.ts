import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSeanceComponent } from './edit-seance.component';

describe('EditSeanceComponent', () => {
  let component: EditSeanceComponent;
  let fixture: ComponentFixture<EditSeanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSeanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSeanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
