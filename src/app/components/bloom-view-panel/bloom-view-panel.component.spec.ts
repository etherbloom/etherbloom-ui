import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloomViewPanelComponent } from './bloom-view-panel.component';

describe('BloomViewPanelComponent', () => {
  let component: BloomViewPanelComponent;
  let fixture: ComponentFixture<BloomViewPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BloomViewPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloomViewPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
