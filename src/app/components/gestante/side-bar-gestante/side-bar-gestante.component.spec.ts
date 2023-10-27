import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarGestanteComponent } from './side-bar-gestante.component';

describe('SideBarGestanteComponent', () => {
  let component: SideBarGestanteComponent;
  let fixture: ComponentFixture<SideBarGestanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideBarGestanteComponent]
    });
    fixture = TestBed.createComponent(SideBarGestanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
