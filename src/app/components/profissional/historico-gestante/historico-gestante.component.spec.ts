import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoGestanteComponent } from './historico-gestante.component';

describe('HistoricoGestanteComponent', () => {
  let component: HistoricoGestanteComponent;
  let fixture: ComponentFixture<HistoricoGestanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricoGestanteComponent]
    });
    fixture = TestBed.createComponent(HistoricoGestanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
