import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenitPasswordComponent } from './renit-password.component';



describe('ListMembreComponent', () => {
  let component: RenitPasswordComponent;
  let fixture: ComponentFixture<RenitPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenitPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenitPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
