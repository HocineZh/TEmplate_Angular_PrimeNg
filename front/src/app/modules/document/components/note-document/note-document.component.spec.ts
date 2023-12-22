import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteDocumentComponent } from './note-document.component';

describe('NoteDocumentComponent', () => {
  let component: NoteDocumentComponent;
  let fixture: ComponentFixture<NoteDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
