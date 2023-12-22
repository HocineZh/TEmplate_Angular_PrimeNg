import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModelFctComponent } from './list-model-fct.component';

describe('ListModelFctComponent', () => {
  let component: ListModelFctComponent;
  let fixture: ComponentFixture<ListModelFctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListModelFctComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListModelFctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
