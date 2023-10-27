import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestanteComponent } from './gestante.component';


describe('GestanteComponent', () => {
  let component: GestanteComponent;
  let fixture: ComponentFixture<GestanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestanteComponent]
    });
    fixture = TestBed.createComponent(GestanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
