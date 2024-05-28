import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentAppBarComponent } from './app-bar.component';

describe('ComponentAppBarComponent', () => {
  let component: ComponentAppBarComponent;
  let fixture: ComponentFixture<ComponentAppBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentAppBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentAppBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
