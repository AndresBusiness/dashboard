import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarChoferComponent } from './agregar-chofer.component';

describe('AgregarChoferComponent', () => {
  let component: AgregarChoferComponent;
  let fixture: ComponentFixture<AgregarChoferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarChoferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarChoferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
