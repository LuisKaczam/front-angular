import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditGestanteComponent } from './form-edit-gestante.component';

describe('FormEditGestanteComponent', () => {
  let component: FormEditGestanteComponent;
  let fixture: ComponentFixture<FormEditGestanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormEditGestanteComponent]
    });
    fixture = TestBed.createComponent(FormEditGestanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
