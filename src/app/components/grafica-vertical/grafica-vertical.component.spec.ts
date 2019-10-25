import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficaVerticalComponent } from './grafica-vertical.component';

describe('GraficaVerticalComponent', () => {
  let component: GraficaVerticalComponent;
  let fixture: ComponentFixture<GraficaVerticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficaVerticalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficaVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
