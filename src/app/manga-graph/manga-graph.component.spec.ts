import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MangaGraphComponent } from './manga-graph.component';

describe('MangaGraphComponent', () => {
  let component: MangaGraphComponent;
  let fixture: ComponentFixture<MangaGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MangaGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangaGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
