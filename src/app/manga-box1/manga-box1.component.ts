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
  imageLoaded = false;

  FilterOptions: string[] = [];
  GenreOptions: string[] = ["Action","Adventure","Comedy","Drama","Ecchi","Fantasy","Horror","Mahou Shoujo","Mecha","Music","Mystery","Psychological","Romance","Sc-Fi","Slice of Life","Sports","Supernatural","Thriller"];
  YearOptions: string[] = ["2025","2024","2023","2022","2021","2020","2019","2018","2017","2016"];
  mangaFace: Manga[] = [];

  showMoreButton = true;

  handleClick(value:string){
    this.showMoreButton = false;
    this.mangaTitle = value;
    console.log("User input:",this.mangaTitle);


      this.loadData(this.FilterOptions,this.mangaLimit,this.YearOption);
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

  deleteFilterOption(option: string) {
    const index = this.FilterOptions.indexOf(option);
    this.FilterOptions.splice(index,1);
    console.log(this.FilterOptions);
  }

  deleteYearOption(option: string) {
    this.YearOption = "any";
  }

  resetFilterOptions() {
    this.FilterOptions.length = 0;
    console.log("Cleared FilterOptions",this.FilterOptions);
  }

  loadPopularManga(limit: string,year: string) {
    this.showMoreButton = true;
    this.mangaInfoService.getPopularManga(limit,year).subscribe(data => {
      this.loadMangaInfos(data);
    })
  }

  loadLastYearManga(limit: string) {
    // popular manga last year
    var date = new Date().getFullYear() - 1;
    let stringDate = date.toString();
    this.loadPopularManga(limit,stringDate);
  }

  loadNewManga(limit: string) {
    // New manga this year
    var date = new Date().getFullYear().toString();
    this.loadData(this.FilterOptions,limit,date);
  }

  constructor(private mangaInfoService: MangaServiceService,private sharedData: SharedDataService) {
    if (this.sharedData.lastSearch !== "") {
      this.clearManga();
      this.handleClick(this.sharedData.lastSearch);
    }else{
      this.loadHomeScreen();
    }
  }


 loadMore() {
   this.clearManga();
   this.loadPopularManga("40","");
 }

 loadLess() {
   this.clearManga();
   this.loadHomeScreen();

 }

  loadHomeScreen() {

      this.mangaTitle = "";
      this.sharedData.lastSearch = "";

      this.loadPopularManga("9","");
      this.loadNewManga("9");
      this.loadLastYearManga("6");
  }


 loadData(FilterOptions: string[],limit: string,year: string){
    this.clearManga();
    this.mangaInfoService.getMangaInformation(this.mangaTitle,FilterOptions,year,limit).subscribe(data => {
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

   try {


      for (let i =0;i<mangaData.data.length;i++) {
        let title =  mangaData.data[i]["attributes"]["title"];
        this.sharedData.desc =  mangaData.data[i]["attributes"]["description"];
        let manga_title = mangaData.data[i]["attributes"]["title"]["en"] || Object.values(title)[0];
        let manga_id = mangaData.data[i]["id"];


        this.mangaInfoService.getMangaImageData(manga_id).subscribe((imageData: any) => {
          var filename = imageData.data[0].attributes.fileName || "Kein Bild";
          const imageUrl = `https://uploads.mangadex.org/covers/${manga_id}/${filename}`;

          const newManga: Manga = {
            title:manga_title,
            description: "",
            image:imageUrl,
            id:manga_id,
            fileName: filename,
            stat: "",
            year: "",
            content: "",
          };
        this.mangaFace.push(newManga);
        this.sharedData.addManga(newManga);


        })



        //console.log(this.mangaFace);
      }
   }catch(err){
     console.log(err);
   }




  }

}

