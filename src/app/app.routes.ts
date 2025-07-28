import { Routes } from '@angular/router';
import { MangaDetailsComponent } from './manga-details/manga-details.component';
import { MangaBox1Component } from './manga-box1/manga-box1.component';
import { StartPageComponent } from './start-page/start-page.component';

export const routes: Routes = [

    { path: '',component: StartPageComponent}, // Startseite
    { path: 'manga/suche',component: MangaBox1Component}, // Startseite
    { path: 'manga/:title',component: MangaDetailsComponent}, // Manga-details

];
