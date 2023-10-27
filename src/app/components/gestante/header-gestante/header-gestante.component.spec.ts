import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderGestanteComponent } from './header-gestante.component';

describe('HeaderGestanteComponent', () => {
  let component: HeaderGestanteComponent;
  let fixture: ComponentFixture<HeaderGestanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderGestanteComponent]
    });
    fixture = TestBed.createComponent(HeaderGestanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
