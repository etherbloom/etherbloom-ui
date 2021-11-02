import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloomDetailComponent } from './bloom-detail.component';

describe('BloomDetailComponent', () => {
  let component: BloomDetailComponent;
  let fixture: ComponentFixture<BloomDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BloomDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloomDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
