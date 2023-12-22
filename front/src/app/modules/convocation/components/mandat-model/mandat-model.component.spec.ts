import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatModelComponent } from './mandat-model.component';

describe('MandatModelComponent', () => {
  let component: MandatModelComponent;
  let fixture: ComponentFixture<MandatModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MandatModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MandatModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
