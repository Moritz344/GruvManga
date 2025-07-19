import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MangaBox1Component } from './manga-box1/manga-box1.component';
import { FormsModule } from '@angular/forms';
import { MangaDetailsComponent } from './manga-details/manga-details.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MangaBox1Component,FormsModule,MangaDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mangaApp';
}
