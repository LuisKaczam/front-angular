import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBabiesComponent } from './list-babies.component';

describe('ListBabiesComponent', () => {
  let component: ListBabiesComponent;
  let fixture: ComponentFixture<ListBabiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBabiesComponent]
    });
    fixture = TestBed.createComponent(ListBabiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
