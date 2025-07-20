import { Component } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule} from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Manga } from '../manga-box1/manga';
import { MangaServiceService } from '../manga-service.service';

@Component({
  selector: 'app-manga-details',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './manga-details.component.html',
  styleUrl: './manga-details.component.css',
  providers: [MangaServiceService]
})

export class MangaDetailsComponent {
  mangaTitle: any;
  mangaDetail: Manga[] = [];
  mangaData: any;

  handleHomeClick() {
    // TODO: save last search
    console.log("HOME SWEET HOME");
  }

  constructor(private mangaInfoService: MangaServiceService,private route: ActivatedRoute ) {

    this.route.params.subscribe(params => {
      this.mangaTitle = params["title"];

      this.loadData();


    })



  }


 loadData(){
    this.mangaInfoService.getMangaInformation(this.mangaTitle,[""],"").subscribe(data => {
      this.mangaData = data;

      console.log(data);

      let descriptions = this.mangaData.data[0]["attributes"]["description"] ;
      let descLen = Object.keys(descriptions).length;

      if (descLen >= 1) {
        var desc = descriptions["en"] || Object.values(descriptions[0]) ;
      }else{
        alert("No description found");
      }


      let manga_id = this.mangaData.data[0]["id"];


        this.mangaInfoService.getMangaImageData(manga_id).subscribe((imageData: any) => {
          const filename = imageData.data[0].attributes.fileName || "Kein Bild";
          const imageUrl = `https://uploads.mangadex.org/covers/${manga_id}/${filename}`;

          const newManga: Manga = {
            title: this.mangaTitle,
            description: desc,
            image:imageUrl,
            id:"",
            fileName: filename,
          };
          this.mangaDetail.push(newManga);


        })


    });

  }




}
