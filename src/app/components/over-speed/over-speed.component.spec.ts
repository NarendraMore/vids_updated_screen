import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverSpeedComponent } from './over-speed.component';

describe('OverSpeedComponent', () => {
  let component: OverSpeedComponent;
  let fixture: ComponentFixture<OverSpeedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverSpeedComponent]
    });
    fixture = TestBed.createComponent(OverSpeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
