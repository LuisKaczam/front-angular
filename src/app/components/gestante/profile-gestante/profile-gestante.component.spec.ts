import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileGestanteComponent } from './profile-gestante.component';

describe('ProfileGestanteComponent', () => {
  let component: ProfileGestanteComponent;
  let fixture: ComponentFixture<ProfileGestanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileGestanteComponent]
    });
    fixture = TestBed.createComponent(ProfileGestanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
