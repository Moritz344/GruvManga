import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Manga } from './manga-box1/manga';

@Injectable({
  providedIn: 'root'
})
export class MangaServiceService {

  mangas: Manga[] = [];

  baseUrl = "https://api.mangadex.org";

  constructor(private http: HttpClient) {

  }

    getMangaInformation(mangaTitle: string) {
        const url = ` ${this.baseUrl}/manga?title=${encodeURIComponent(mangaTitle)}`;
        return this.http.get(url);

    }

    getMangaImageData(manga_id: string) {

      const url = `https://api.mangadex.org/cover?manga[]=${manga_id}` ;
      return this.http.get(url);
    }

   setMangas(mangas: Manga[]) {
     this.mangas = mangas;
     localStorage.setItem('mangas',JSON.stringify(mangas));
     console.log("Save manga",this.mangas);
   }



  }
