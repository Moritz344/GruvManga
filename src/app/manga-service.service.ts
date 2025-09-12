import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Manga } from './manga-box1/manga';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MangaServiceService {

  mangas: Manga[] = [];

  baseUrl = "https://api.mangadex.org";

  constructor(private http: HttpClient) {

  }


    getPopularManga(limit:string,year: string,contentRating: string) {
        const params = new URLSearchParams();
        if ( year !== "" ) {
            params.append("year",year);
        }
        if ( limit !== "" ) {
          params.append("limit",limit);
        }

        if ( contentRating !== "" ) {
          params.append("contentRating[]",contentRating);
        }
        const url = `${this.baseUrl}/manga?&order[followedCount]=desc&${params.toString()}`;
        return this.http.get(url);


    }

    getFilterUUIDs(FilterOptions: string[]): Observable<string[]> {
        const tagsUrl = `${this.baseUrl}/manga/tag`;
        return this.http.get<any>(tagsUrl).pipe(
            map(response =>
                response.data
                    .filter((tag: any) => FilterOptions.includes(tag.attributes.name.en))
                    .map((tag: any) => tag.id)
               )
        );
    }

    getMangaInformation(mangaTitle: string, FilterOptions: string[],year: string,limit: string,offset: string,contentRating: string,status: string): Observable<any> {
        return this.getFilterUUIDs(FilterOptions).pipe(
            switchMap((includedTagIDs: string[]) => {
                const params = new URLSearchParams();
                for (const id of includedTagIDs) {
                    params.append("includedTags[]", id);
                }



                params.append("limit",limit);
                if (year !== "any" && year !== "" ) {
                    params.append("year",year);
                }
                if ( contentRating !== "" && contentRating !== "any" ) {
                  params.append("contentRating[]",contentRating);

                }

                if (status !== "" && status !== "any") {
                  params.append("status[]",status.toLowerCase());
                }

                if (mangaTitle !== "" && mangaTitle !== "any") {
                  params.append("title",mangaTitle);
                }


                const url = `${this.baseUrl}/manga?offset=${offset}&${params.toString()}&includedTagsMode=AND`;

                return this.http.get(url);

            })
        );
    }

    getMangaStatistics(manga_id: string) {
      const url = `${this.baseUrl}/statistics/manga/${manga_id}` ;
      return this.http.get(url);
    }



    getMangaChapters(mangaId: string,) {
      const url = `${this.baseUrl}/manga/${mangaId}/feed?translatedLanguage[]=en&order[chapter]=asc`;
      return this.http.get(url);
    }


    getMangaImageData(manga_id: string) {
      const url = `${this.baseUrl}/cover?manga[]=${manga_id}` ;
      return this.http.get(url);
    }





  }
