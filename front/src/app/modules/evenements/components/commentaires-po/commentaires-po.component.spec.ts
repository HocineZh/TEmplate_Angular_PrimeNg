import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentairesPoComponent } from './commentaires-po.component';

describe('CommentairesPoComponent', () => {
  let component: CommentairesPoComponent;
  let fixture: ComponentFixture<CommentairesPoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentairesPoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentairesPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
