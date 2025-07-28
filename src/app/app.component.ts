import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MangaBox1Component } from './manga-box1/manga-box1.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MangaBox1Component,FormsModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mangaApp';
}
