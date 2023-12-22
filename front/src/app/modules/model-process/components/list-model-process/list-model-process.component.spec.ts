import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModelProcessComponent } from './list-model-process.component';

describe('ListModelProcessComponent', () => {
  let component: ListModelProcessComponent;
  let fixture: ComponentFixture<ListModelProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListModelProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListModelProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
