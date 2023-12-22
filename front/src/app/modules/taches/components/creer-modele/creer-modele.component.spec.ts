import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerModeleComponent } from './creer-modele.component';

describe('CreerModeleComponent', () => {
  let component: CreerModeleComponent;
  let fixture: ComponentFixture<CreerModeleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreerModeleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerModeleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
