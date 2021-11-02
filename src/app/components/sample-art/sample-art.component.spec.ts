import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleArtComponent } from './sample-art.component';

describe('SampleArtComponent', () => {
  let component: SampleArtComponent;
  let fixture: ComponentFixture<SampleArtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleArtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
