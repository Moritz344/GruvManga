import { Component } from '@angular/core';
import { MangaServiceService } from '../manga-service.service';
import { Manga } from './manga';
import { CommonModule} from '@angular/common';
import { FormsModule} from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SharedDataService } from '../shared-data.service';
import { MangaHoverCardComponent } from '../manga-hover-card/manga-hover-card.component';
import { NgOptimizedImage } from '@angular/common'

// TODO: different component for popular manga area, new manga area?
// BUG: duplicate mangas at pages
// TODO: loading animation / message if no result

@Component({
  selector: 'app-manga-box1',
  imports: [RouterModule,CommonModule,FormsModule,MangaHoverCardComponent,NgOptimizedImage],
  templateUrl: './manga-box1.component.html',
  styleUrl: './manga-box1.component.css',
  providers: [
    MangaServiceService,
  ]
})
export class MangaBox1Component {
  mangaData: any;
  UserInput: any;

  mangaTitle = "";
  mangaDesc = "";

  inputValue = "";
  GenreFilter = "";
  YearOption = "";

  mangaLimit = "20";
  imageLoaded = false;


  hoveredManga: any = null;
  hoverX: number = 0;
  hoverY: number = 0;
  barClosed: boolean = true;
  filterBarClosed: boolean = true;


  seite = "0";
  currentSeite = "";
  totalNumber: number = 0;
  totalArray = Array.from({ length: 10 },(_,i) => i+1)
  activeSite = 0;
  startSite = 0;



  fullChapter: number = 0;

  FilterOptions: string[] = [];
  GenreOptions: string[] = ["Action","Adventure","Comedy","Drama","Ecchi","Fantasy","Horror","Mahou Shoujo","Mecha","Music","Mystery","Psychological","Romance","Sc-Fi","Slice of Life","Sports","Supernatural","Thriller"];
  YearOptions: string[] = ["2025","2024","2023","2022","2021","2020","2019","2018","2017","2016"];
  StatusOptions: string[] = ["ongoing","completed","cancelled","hiatus"];
  StatusOption = "any";
  ContentRatingOptions: string[] = ["safe","suggestive","erotica"];
  ContentRatingOption = "safe";
  mangaFace: Manga[] = [];

  showLoadingAnimation = false; // loading animation value
  showNoResultsText = false;
  showMoreButton = true;

  handleClick(value:string){
    this.showMoreButton = false;
    this.mangaTitle = value;
    this.sharedData.lastInput = value;
    console.log("User input:",this.mangaTitle);
    this.loadData(this.FilterOptions,this.mangaLimit,this.YearOption,this.seite,"");
  }

  handleContentRatingOption(value: string) {
    this.ContentRatingOption = value;
    console.log("Content Rating Option:",this.ContentRatingOption);
  }

  handleStatusOption(value: string) {
    this.StatusOption = value;
    console.log(value);
  }

  toggleFilterBar() {
    this.filterBarClosed = !this.filterBarClosed;
    console.log("Filter bar closed:",this.filterBarClosed);

  }

  closeFilterBar() {
    this.filterBarClosed = true;
    console.log("Filter bar closed:",this.filterBarClosed);
  }

  handleYearOption(value: string) {
    this.YearOption = value;
    console.log(this.YearOption);
  }

  showHoverCard(manga: any,event: MouseEvent) {
    this.hoveredManga = manga;
    this.updateHoverPosition(event,"");
  }

  closeSideBar() {
    console.log("close sidebar");
    this.barClosed = true;
  }
  openSideBar() {
    console.log("open sidebar");
    this.barClosed = false;
  }

  updateHoverPosition(event: MouseEvent,manga: any) {
      this.hoverX = event.pageX + 40
      this.hoverY = event.pageY - 20


  }

  hideHoverCard() {
    this.hoveredManga = null;
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
    this.YearOption = "any";
    console.log("Cleared FilterOptions",this.FilterOptions);
  }

  loadPopularManga(limit: string,year: string,contentRating: string) {
    this.showMoreButton = true;
    this.mangaInfoService.getPopularManga(limit,year,contentRating).subscribe(data => {
      this.loadMangaInfos(data);
    })
  }

  loadLastYearManga(limit: string) {
    // popular manga last year
    var date = new Date().getFullYear() - 1;
    let stringDate = date.toString();
    this.loadPopularManga(limit,stringDate,"safe");
  }

  loadNewManga(limit: string) {
    // New manga this year
    var date = new Date().getFullYear().toString();
    this.loadData(this.FilterOptions,limit,date,this.seite,"safe");
  }

  constructor(private mangaInfoService: MangaServiceService,private sharedData: SharedDataService) {
    this.clearManga();
    if (this.mangaTitle.length === 0) {
      this.handleClick(this.sharedData.lastInput);

    }




  }


 loadMore() {
   this.clearManga();
   this.loadPopularManga("40","","safe");
 }

 loadLess() {
   this.clearManga();
   this.loadHomeScreen();

 }

  loadHomeScreen() {
      this.mangaTitle = "";
      this.sharedData.lastSearch = "";

      this.clearManga();


      this.loadPopularManga("","","safe");
      this.loadNewManga("9");
      //this.loadLastYearManga("6");

  }

  loadMoreMangas() {
    // NOTE: total -> totale anzahl an mangas für suche -> offset = seite
    this.clearManga();
    this.currentSeite += 24;

    this.loadData(this.FilterOptions,"23","any",this.currentSeite.toString(),"");
    console.log("test");
  }

 loadData(FilterOptions: string[],limit: string,year: string,offset: string,contentRating: string){
    this.clearManga();
   console.log("content rating:",this.ContentRatingOption);
   this.mangaInfoService.getMangaInformation(this.mangaTitle,FilterOptions,year,limit,offset,this.ContentRatingOption,this.StatusOption).subscribe(data => {
      this.mangaData = data;
      console.log(data);
      if (this.mangaData.data["length"] > 0 ) {
        console.log("manga data is more than 0");
        this.totalNumber = data.total;
        this.loadMangaInfos(data);

      }

     if (this.mangaData["total"] === 0) {
       this.showNoResultsText = true;
       console.log("no result");
     }else{
       this.showNoResultsText = false;
     }

    });

  }

  updateTotalArray() {
  if (this.activeSite >= this.startSite + 10) {
    this.startSite += 10;
  }

  if (this.activeSite < this.startSite && this.activeSite !== 1) {
    this.startSite -= 10;
    if (this.startSite < 0) this.startSite = 0;
  }else if (this.activeSite === 1) {
    this.startSite = 1;
  }

  this.totalArray = Array.from({ length: 10 }, (_, i) => i + this.startSite);
  }

clearManga() {
  this.mangaFace.splice(0,this.mangaFace.length);

  this.updateTotalArray();
}


  loadPage(page: number) {

    let pageNumber = page.toString();
    this.currentSeite = page.toString();
    this.activeSite = page;
    this.loadData(this.FilterOptions,"20","any",pageNumber,"");
  }

  loadNextPage() {
    this.clearManga();
    this.currentSeite = (Number(this.currentSeite) + 1).toString();

    this.activeSite = Number(this.currentSeite );
    console.log("active site:",this.activeSite);
    console.log(this.FilterOptions);
    this.loadData(this.FilterOptions,"20","any",this.currentSeite,"");
    console.log(this.currentSeite);
  }

  loadPrevPage() {
    if ( this.currentSeite >= "1") {
      console.log("LOAD PREVIOUS PAGE");
      this.currentSeite = (Number(this.currentSeite) - 1).toString();

      this.activeSite = Number(this.currentSeite );
      this.loadData(this.FilterOptions,"20","any",this.currentSeite,"");
    }

  }

 loadMangaInfos(mangaData: any) {

   try {

      for (let i =0;i<mangaData.data.length;i++) {
        let title =  mangaData.data[i]["attributes"]["title"];
        this.sharedData.desc =  mangaData.data[i]["attributes"]["description"];
        let desc =  mangaData.data[i]["attributes"]["description"]["en"];
        let manga_title = mangaData.data[i]["attributes"]["title"]["en"] || Object.values(title)[0];
        let manga_id = mangaData.data[i]["id"];
        let manga_status = mangaData.data[i]["attributes"]["status"];
        let mangaYear = mangaData.data[i]["attributes"]["year"];
        let contentRating = mangaData.data[i]["attributes"]["contentRating"];
        let chapterAmount = mangaData.data[i]["attributes"]["lastChapter"];



        this.mangaInfoService.getMangaChapters(manga_id).subscribe((chapterData: any) => {
          if (chapterData.data.length >= 1) {
            var chapters = chapterData.data[chapterData.data.length - 1]["attributes"]["chapter"] || "";
          }

      this.mangaInfoService.getMangaStatistics(manga_id).subscribe((data: any) => {
        const mangaRating = Number(data.statistics[manga_id]["rating"]["average"]).toFixed(1);
        let alternativeTitles = "";

        this.mangaInfoService.getMangaImageData(manga_id).subscribe((imageData: any) => {
          var filename = imageData.data[0].attributes.fileName || "Kein Bild";
          const imageUrl = `https://uploads.mangadex.org/covers/${manga_id}/${filename}.256.jpg`;
          const thumb = `https://uploads.mangadex.org/covers/${manga_id}/${filename}.512.jpg`;


          const newManga: Manga = {
            title:manga_title,
            description: desc,
            image:imageUrl,
            id:manga_id,
            fileName: filename,
            stat: manga_status,
            year: mangaYear,
            content: contentRating,
            chapter: chapters,
            rating: mangaRating.toString(),
            thumbnail: thumb
          };
        this.mangaFace.push(newManga);
        this.sharedData.addManga(newManga);



        })
      })
        });


        //console.log(this.mangaFace);
      }
   }catch(err){
     console.log(err);
   }




  }

}

