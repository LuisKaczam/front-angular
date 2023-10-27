import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosProfissionalComponent } from './infos-profissional.component';

describe('InfosProfissionalComponent', () => {
  let component: InfosProfissionalComponent;
  let fixture: ComponentFixture<InfosProfissionalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfosProfissionalComponent]
    });
    fixture = TestBed.createComponent(InfosProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
