import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllegalComponent } from './illegal.component';

describe('IllegalComponent', () => {
  let component: IllegalComponent;
  let fixture: ComponentFixture<IllegalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IllegalComponent]
    });
    fixture = TestBed.createComponent(IllegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
