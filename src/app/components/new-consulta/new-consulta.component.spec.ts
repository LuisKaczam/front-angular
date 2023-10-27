import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewConsultaComponent } from './new-consulta.component';

describe('NewConsultaComponent', () => {
  let component: NewConsultaComponent;
  let fixture: ComponentFixture<NewConsultaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewConsultaComponent]
    });
    fixture = TestBed.createComponent(NewConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
