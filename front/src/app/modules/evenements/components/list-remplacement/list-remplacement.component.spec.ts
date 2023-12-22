import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRemplacementComponent } from './list-remplacement.component';

describe('ListRemplacementComponent', () => {
  let component: ListRemplacementComponent;
  let fixture: ComponentFixture<ListRemplacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRemplacementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRemplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
