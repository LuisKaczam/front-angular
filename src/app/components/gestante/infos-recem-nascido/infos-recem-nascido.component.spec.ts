import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosRecemNascidoComponent } from './infos-recem-nascido.component';

describe('InfosRecemNascidoComponent', () => {
  let component: InfosRecemNascidoComponent;
  let fixture: ComponentFixture<InfosRecemNascidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfosRecemNascidoComponent]
    });
    fixture = TestBed.createComponent(InfosRecemNascidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
