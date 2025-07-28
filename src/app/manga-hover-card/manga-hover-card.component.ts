import { Component,Input } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-manga-hover-card',
  imports: [CommonModule,FormsModule],
  templateUrl: './manga-hover-card.component.html',
  styleUrl: './manga-hover-card.component.css',

})
export class MangaHoverCardComponent {
  @Input() manga: any;
  @Input() x: number = 0;
  @Input() y: number = 0;




}
