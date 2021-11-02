import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloomPageComponent } from './bloom-page.component';

describe('BloomPageComponent', () => {
  let component: BloomPageComponent;
  let fixture: ComponentFixture<BloomPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BloomPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
