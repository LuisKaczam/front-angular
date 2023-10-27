import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginGestanteComponent } from './login-gestante.component';

describe('LoginGestanteComponent', () => {
  let component: LoginGestanteComponent;
  let fixture: ComponentFixture<LoginGestanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginGestanteComponent]
    });
    fixture = TestBed.createComponent(LoginGestanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
