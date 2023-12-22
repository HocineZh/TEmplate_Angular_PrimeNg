import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModelOjComponent } from './list-model-oj.component';

describe('ListModelOjComponent', () => {
  let component: ListModelOjComponent;
  let fixture: ComponentFixture<ListModelOjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListModelOjComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListModelOjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
