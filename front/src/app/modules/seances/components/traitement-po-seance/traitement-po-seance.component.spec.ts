import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraitementPoSeanceComponent } from './traitement-po-seance.component';

describe('TraitementPoSeanceComponent', () => {
  let component: TraitementPoSeanceComponent;
  let fixture: ComponentFixture<TraitementPoSeanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraitementPoSeanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraitementPoSeanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
