import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrvFiltersSidebarComponent } from './prv-filters-sidebar.component';

describe('PrvFiltersSidebarComponent', () => {
  let component: PrvFiltersSidebarComponent;
  let fixture: ComponentFixture<PrvFiltersSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrvFiltersSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrvFiltersSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
