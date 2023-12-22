import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropositionsMembresOdjComponent } from './propositions-membres-odj.component';

describe('PropositionsMembresOdjComponent', () => {
  let component: PropositionsMembresOdjComponent;
  let fixture: ComponentFixture<PropositionsMembresOdjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropositionsMembresOdjComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropositionsMembresOdjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
