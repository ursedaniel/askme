import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindconnectionComponent } from './findconnection.component';

describe('FindconnectionComponent', () => {
  let component: FindconnectionComponent;
  let fixture: ComponentFixture<FindconnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindconnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindconnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
