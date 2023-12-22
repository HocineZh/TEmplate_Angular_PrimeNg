import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModelDelaiComponent } from './list-model-delai.component';

describe('ListModelDelaiComponent', () => {
  let component: ListModelDelaiComponent;
  let fixture: ComponentFixture<ListModelDelaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListModelDelaiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListModelDelaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
