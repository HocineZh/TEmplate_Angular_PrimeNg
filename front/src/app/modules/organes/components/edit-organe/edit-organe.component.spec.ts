import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddModelOjComponent } from 'src/app/modules/model-ordre-jour/components/add-model-oj/add-model-oj.component';


describe('AddModelOjComponent', () => {
  let component: AddModelOjComponent;
  let fixture: ComponentFixture<AddModelOjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModelOjComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModelOjComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
