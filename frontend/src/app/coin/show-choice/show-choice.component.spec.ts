import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowChoiceComponent } from './show-choice.component';

describe('ShowChoiceComponent', () => {
  let component: ShowChoiceComponent;
  let fixture: ComponentFixture<ShowChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
