import { Injectable } from '@angular/core';
import { Manga } from './manga-box1/manga';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class SharedDataService {
    public lastInput: string = "";
    public lastSearch: string = "";
    public desc: string = "";
    private distSubject = new BehaviorSubject<{[key: string]: number}>({});
    dist$ = this.distSubject.asObservable();

    mangas: Manga[] = [];

    setDist(dist: {[key: string]: number}) {
        this.distSubject.next(dist);
    }

    addManga(manga: Manga): void{
        this.mangas.push(manga);
    }

    getMangaList(): Manga[]{
        return this.mangas;
    }
}
