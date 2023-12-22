import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPointsAjournesOgComponent } from './list-points-ajournes-og.component';

describe('ListPointsAjournesOgComponent', () => {
  let component: ListPointsAjournesOgComponent;
  let fixture: ComponentFixture<ListPointsAjournesOgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPointsAjournesOgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPointsAjournesOgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
