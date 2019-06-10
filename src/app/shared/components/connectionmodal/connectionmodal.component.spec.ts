import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionmodalComponent } from './connectionmodal.component';

describe('ConnectionmodalComponent', () => {
  let component: ConnectionmodalComponent;
  let fixture: ComponentFixture<ConnectionmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
