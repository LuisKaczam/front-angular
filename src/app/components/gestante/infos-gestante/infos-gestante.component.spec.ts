import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosGestanteComponent } from './infos-gestante.component';

describe('InfosGestanteComponent', () => {
  let component: InfosGestanteComponent;
  let fixture: ComponentFixture<InfosGestanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfosGestanteComponent]
    });
    fixture = TestBed.createComponent(InfosGestanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
