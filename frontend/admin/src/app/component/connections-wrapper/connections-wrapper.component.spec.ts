import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionsWrapperComponent } from './connections-wrapper.component';

describe('ConnectionsComponent', () => {
  let component: ConnectionsWrapperComponent;
  let fixture: ComponentFixture<ConnectionsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectionsWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
