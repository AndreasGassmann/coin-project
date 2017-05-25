import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirteenReasonsWhyComponent } from './thirteen-reasons-why.component';

describe('ThirteenReasonsWhyComponent', () => {
  let component: ThirteenReasonsWhyComponent;
  let fixture: ComponentFixture<ThirteenReasonsWhyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirteenReasonsWhyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirteenReasonsWhyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
