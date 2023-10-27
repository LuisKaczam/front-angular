import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarGestanteComponent } from './calendar-gestante.component';

describe('CalendarGestanteComponent', () => {
  let component: CalendarGestanteComponent;
  let fixture: ComponentFixture<CalendarGestanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarGestanteComponent]
    });
    fixture = TestBed.createComponent(CalendarGestanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
