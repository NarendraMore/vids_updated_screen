import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripWireComponent } from './trip-wire.component';

describe('TripWireComponent', () => {
  let component: TripWireComponent;
  let fixture: ComponentFixture<TripWireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripWireComponent]
    });
    fixture = TestBed.createComponent(TripWireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
