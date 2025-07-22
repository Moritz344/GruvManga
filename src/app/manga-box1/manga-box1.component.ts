import { Component } from '@angular/core';
import { MangaServiceService } from '../manga-service.service';
import { Manga } from './manga';
import { CommonModule} from '@angular/common';
import { FormsModule} from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SharedDataService } from '../shared-data.service';

// TODO: show activated filters

@Component({
  selector: 'app-manga-box1',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './manga-box1.component.html',
  styleUrl: './manga-box1.component.css',
  providers: [MangaServiceService]
})
export class MangaBox1Component {
  // TODO: pages
  mangaData: any;
  UserInput: any;

  mangaTitle = "";
  mangaDesc = "";

  inputValue = "";
  GenreFilter = "";
  YearOption = "";

  mangaLimit = "20";

  FilterOptions: string[] = [];

  mangaFace: Manga[] = [];

  showMoreButton = true;

  handleClick(value:string){
    this.showMoreButton = false;
    this.mangaTitle = value;
    console.log("User input:",this.mangaTitle);


      this.loadData(this.FilterOptions,this.mangaLimit);
  }

  handleYearOption(value: string) {
    this.YearOption = value;
    console.log(this.YearOption);
  }

  handleFilterOption(value: string) {
    if (!this.FilterOptions.includes(value) && value !== "any") {
      this.GenreFilter = value;
      this.FilterOptions.push(value);
      console.log("Current FilterOptions:",this.FilterOptions)

    }
  }

  resetFilterOptions() {
    this.FilterOptions.length = 0;
    console.log("Cleared FilterOptions",this.FilterOptions);
  }

  loadPopularManga(limit: string) {
    this.showMoreButton = true;
    this.mangaInfoService.getPopularManga(limit).subscribe(data => {
      this.loadMangaInfos(data);
    })
  }

  constructor(private mangaInfoService: MangaServiceService,private sharedData: SharedDataService) {
    if (this.sharedData.lastSearch !== "") {
      this.handleClick(this.sharedData.lastSearch);
    }else{
      this.loadPopularManga("20");
    }
  }


 loadMore() {
   this.loadPopularManga("40");
 }

 loadLess() {
   this.loadPopularManga("20");

 }

 loadData(FilterOptions: string[],limit: string){
    this.mangaInfoService.getMangaInformation(this.mangaTitle,FilterOptions,this.YearOption,limit).subscribe(data => {
      this.mangaData = data;
      if (this.mangaData.data["length"] > 0 ) {

        this.loadMangaInfos(data);

      }else{
        this.mangaTitle = "No results";
      }

    });

  }

clearManga() {
  this.mangaFace.splice(0,this.mangaFace.length);
}

 loadMangaInfos(mangaData: any) {



      this.clearManga();

      for (let i =0;i<mangaData.data.length;i++) {
        let title =  mangaData.data[i]["attributes"]["title"];
        let manga_title = mangaData.data[i]["attributes"]["title"]["en"] || Object.values(title)[0];
        let manga_id = mangaData.data[i]["id"];


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

