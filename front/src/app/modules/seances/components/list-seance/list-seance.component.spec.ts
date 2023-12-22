import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSeanceComponent } from './list-seance.component';

describe('ListSeanceComponent', () => {
  let component: ListSeanceComponent;
  let fixture: ComponentFixture<ListSeanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSeanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSeanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
