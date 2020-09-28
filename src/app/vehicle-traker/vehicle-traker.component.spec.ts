import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTrakerComponent } from './vehicle-traker.component';

describe('VehicleTrakerComponent', () => {
  let component: VehicleTrakerComponent;
  let fixture: ComponentFixture<VehicleTrakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTrakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTrakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
