import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRecemNascidoComponent } from './new-recem-nascido.component';

describe('NewRecemNascidoComponent', () => {
  let component: NewRecemNascidoComponent;
  let fixture: ComponentFixture<NewRecemNascidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewRecemNascidoComponent]
    });
    fixture = TestBed.createComponent(NewRecemNascidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
