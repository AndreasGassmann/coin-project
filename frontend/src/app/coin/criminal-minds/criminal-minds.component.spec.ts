import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriminalMindsComponent } from './criminal-minds.component';

describe('CriminalMindsComponent', () => {
  let component: CriminalMindsComponent;
  let fixture: ComponentFixture<CriminalMindsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriminalMindsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriminalMindsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
