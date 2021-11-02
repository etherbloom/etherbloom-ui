import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloomViewComponent } from './bloom-view.component';

describe('BloomViewComponent', () => {
  let component: BloomViewComponent;
  let fixture: ComponentFixture<BloomViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BloomViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
