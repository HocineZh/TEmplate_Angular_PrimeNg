import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImporterModelODJComponent } from './importer-model-odj.component';

describe('ImporterModelODJComponent', () => {
  let component: ImporterModelODJComponent;
  let fixture: ComponentFixture<ImporterModelODJComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImporterModelODJComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImporterModelODJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
