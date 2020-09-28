import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTrakerComponent } from './home-traker.component';

describe('HomeTrakerComponent', () => {
  let component: HomeTrakerComponent;
  let fixture: ComponentFixture<HomeTrakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeTrakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTrakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
