import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomNavbarGestanteComponent } from './bottom-navbar-gestante.component';

describe('BottomNavbarGestanteComponent', () => {
  let component: BottomNavbarGestanteComponent;
  let fixture: ComponentFixture<BottomNavbarGestanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BottomNavbarGestanteComponent]
    });
    fixture = TestBed.createComponent(BottomNavbarGestanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
