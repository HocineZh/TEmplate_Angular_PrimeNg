import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervenantsDepotDocumentsComponent } from './intervenants-depot-documents.component';

describe('IntervenantsDepotDocumentsComponent', () => {
  let component: IntervenantsDepotDocumentsComponent;
  let fixture: ComponentFixture<IntervenantsDepotDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntervenantsDepotDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervenantsDepotDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
