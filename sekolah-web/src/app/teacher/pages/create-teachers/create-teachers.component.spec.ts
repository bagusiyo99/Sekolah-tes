import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTeachersComponent } from './create-teachers.component';

describe('CreateTeachersComponent', () => {
  let component: CreateTeachersComponent;
  let fixture: ComponentFixture<CreateTeachersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTeachersComponent]
    });
    fixture = TestBed.createComponent(CreateTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
