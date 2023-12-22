import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModelProcessComponent } from './update-model-process.component';

describe('UpdateModelProcessComponent', () => {
  let component: UpdateModelProcessComponent;
  let fixture: ComponentFixture<UpdateModelProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModelProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateModelProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
