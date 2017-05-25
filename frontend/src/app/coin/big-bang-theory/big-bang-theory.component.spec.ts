import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BigBangTheoryComponent } from './big-bang-theory.component';

describe('BigBangTheoryComponent', () => {
  let component: BigBangTheoryComponent;
  let fixture: ComponentFixture<BigBangTheoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BigBangTheoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BigBangTheoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
