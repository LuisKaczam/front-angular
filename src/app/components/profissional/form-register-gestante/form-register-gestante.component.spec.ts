import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRegisterGestanteComponent } from './form-register-gestante.component';

describe('FormRegisterGestanteComponent', () => {
  let component: FormRegisterGestanteComponent;
  let fixture: ComponentFixture<FormRegisterGestanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormRegisterGestanteComponent]
    });
    fixture = TestBed.createComponent(FormRegisterGestanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
