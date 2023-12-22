import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUtilTypeOgComponent } from './list-util-type-og.component';

describe('ListUtilTypeOgComponent', () => {
  let component: ListUtilTypeOgComponent;
  let fixture: ComponentFixture<ListUtilTypeOgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListUtilTypeOgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListUtilTypeOgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
