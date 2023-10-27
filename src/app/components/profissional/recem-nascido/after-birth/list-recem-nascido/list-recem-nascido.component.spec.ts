import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRecemNascidoComponent } from './list-recem-nascido.component';

describe('ListRecemNascidoComponent', () => {
  let component: ListRecemNascidoComponent;
  let fixture: ComponentFixture<ListRecemNascidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListRecemNascidoComponent]
    });
    fixture = TestBed.createComponent(ListRecemNascidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
