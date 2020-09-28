import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTrakerComponent } from './map-traker.component';

describe('MapTrakerComponent', () => {
  let component: MapTrakerComponent;
  let fixture: ComponentFixture<MapTrakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTrakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTrakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
