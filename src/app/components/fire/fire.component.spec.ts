import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FireComponent } from './fire.component';

describe('FireComponent', () => {
  let component: FireComponent;
  let fixture: ComponentFixture<FireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FireComponent]
    });
    fixture = TestBed.createComponent(FireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
