import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppSidebarItemComponent } from './app-sidebar-item.component';

describe('AppSidebarItemComponent', () => {
  let component: AppSidebarItemComponent;
  let fixture: ComponentFixture<AppSidebarItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSidebarItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppSidebarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
