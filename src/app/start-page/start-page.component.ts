import { Component,Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule} from '@angular/common';
import { MangaServiceService } from '../manga-service.service';

@Component({
  selector: 'app-start-page',
  imports: [RouterModule,CommonModule],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.css'
})
export class StartPageComponent {

  imageArray: string[] = [];
  imageLoaded: boolean = false;

  constructor(private mangaInfoService: MangaServiceService) {

    this.mangaInfoService.getPopularManga("6","2025").subscribe((data: any ) => {
      for (let i=0;i<data.data.length;i++) {
        let mangaId = data.data[i]["id"];
        this.mangaInfoService.getMangaImageData(mangaId).subscribe((imageData: any) => {
          var filename = imageData.data[0].attributes.fileName || "Kein Bild";
          const imageUrl = `https://uploads.mangadex.org/covers/${mangaId}/${filename}`;
          this.imageArray.push(imageUrl);
        })

      }

    })

  }

}
