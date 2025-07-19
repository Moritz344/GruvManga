import { Component } from '@angular/core';
import { MangaServiceService } from '../manga-service.service';
import { Manga } from './manga';
import { CommonModule} from '@angular/common';
import { FormsModule} from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manga-box1',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './manga-box1.component.html',
  styleUrl: './manga-box1.component.css',
  providers: [MangaServiceService]
})
export class MangaBox1Component {
  mangaData: any;

  mangaTitle = "";
  mangaDesc = "";

  inputValue = "";

  mangaFace: Manga[] = [];


  handleClick(value:string){
    this.mangaTitle = value;
    console.log(this.mangaTitle);


      this.loadData();
  }


  constructor(private mangaInfoService: MangaServiceService, ) {
    this.handleClick("");
  }




 loadData(){
    this.mangaInfoService.getMangaInformation(this.mangaTitle).subscribe(data => {
      this.mangaData = data;
      if (this.mangaData.data["length"] > 0 ) {

        this.loadMangaInfos();

      }else{
        this.mangaTitle = "No results";
      }

    });

  }

clearManga() {
  this.mangaFace.splice(0,this.mangaFace.length);
}

 loadMangaInfos() {



      this.clearManga();

      for (let i =0;i<this.mangaData.data.length;i++) {
        let title =  this.mangaData.data[i]["attributes"]["title"];
        let manga_title = this.mangaData.data[i]["attributes"]["title"]["en"] || Object.values(title)[0];
        let manga_id = this.mangaData.data[i]["id"];


        this.mangaInfoService.getMangaImageData(manga_id).subscribe((imageData: any) => {
          const filename = imageData.data[0].attributes.fileName || "Kein Bild";
          const imageUrl = `https://uploads.mangadex.org/covers/${manga_id}/${filename}`;

          const newManga: Manga = {
            title:manga_title,
            description: "",
            image:imageUrl,
            id:manga_id,
            fileName: filename,
          };
        this.mangaFace.push(newManga);


        })



        //console.log(this.mangaFace);
      }





  }

}

