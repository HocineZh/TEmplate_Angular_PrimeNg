import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModelPojComponent } from './list-model-poj.component';

describe('ListModelPojComponent', () => {
  let component: ListModelPojComponent;
  let fixture: ComponentFixture<ListModelPojComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListModelPojComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListModelPojComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
