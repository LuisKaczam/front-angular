import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecemNascidoComponent } from './recem-nascido.component';


describe('RecemNascidoComponent', () => {
  let component: RecemNascidoComponent;
  let fixture: ComponentFixture<RecemNascidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecemNascidoComponent]
    });
    fixture = TestBed.createComponent(RecemNascidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
