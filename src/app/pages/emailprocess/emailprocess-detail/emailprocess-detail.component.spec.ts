import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailprocessDetailComponent } from './emailprocess-detail.component';

describe('EmailprocessDetailComponent', () => {
  let component: EmailprocessDetailComponent;
  let fixture: ComponentFixture<EmailprocessDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailprocessDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailprocessDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
