import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BilanOrganesComponent } from './bilan-organes.component';

describe('BilanOrganesComponent', () => {
  let component: BilanOrganesComponent;
  let fixture: ComponentFixture<BilanOrganesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BilanOrganesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BilanOrganesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
