import { Component } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule} from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Manga } from '../manga-box1/manga';
import { SimilarManga } from '../manga-box1/manga';
import { MangaServiceService } from '../manga-service.service';
import { SharedDataService } from '../shared-data.service';
import { MangaGraphComponent } from '../manga-graph/manga-graph.component';
import { NgOptimizedImage } from '@angular/common'

// TODO: topbar

@Component({
  selector: 'app-manga-details',
  imports: [RouterModule,CommonModule,FormsModule,MangaGraphComponent,NgOptimizedImage ],
  templateUrl: './manga-details.component.html',
  styleUrl: './manga-details.component.css',
  providers: [MangaServiceService]
})

export class MangaDetailsComponent {
  mangaTitle: any;
  mangaDetail: Manga[] = [];
  similarManga: SimilarManga[] = [];
  mangaData: any;
  imageLoaded = false;
  tagArray: string[] = [];
  SimilarManga: string[] = [];
  SimilarMangaImages: string[] = [];
  alternativeTitles: string[] = [];
  raw_link: string = "";
  ebook_link: string = "";


  handleHomeClick() {
    console.log("User searched for",this.sharedData.lastSearch);
  }


  constructor(private mangaInfoService: MangaServiceService,private route: ActivatedRoute,public sharedData: SharedDataService ) {


    this.route.params.subscribe(params => {
      let lastSearch = params["title"];
      this.sharedData.lastSearch = lastSearch; // nicht last search sondern last manga

      this.loadData();

      console.log("mangas",this.sharedData.getMangaList);
      console.log("mangas",this.sharedData.mangas);

      this.getSimiliarMangas();


    })



  }


  getSimiliarMangas() {
    this.mangaInfoService.getMangaInformation(this.sharedData.lastSearch,this.tagArray,"","10","0").subscribe(data => {

      for (let i=1;i<data.data.length;i++) {
        let manga_id = data.data[i]["id"];
        let name = data.data[i]["attributes"]["title"]["en"];

         this.mangaInfoService.getMangaImageData(manga_id).subscribe((imageData: any) => {
           const filename = imageData.data[0].attributes.fileName || "Kein Bild";
           const imageUrl = `https://uploads.mangadex.org/covers/${manga_id}/${filename}`;
            this.SimilarMangaImages.push(imageUrl);


          const newManga: SimilarManga = {
            title: name,
            image: imageUrl,
          };
          this.similarManga.push(newManga);

      });
    }

    });
  }

 loadData(){
    this.mangaInfoService.getMangaInformation(this.sharedData.lastSearch,[""],"","1","0").subscribe(data => {
      this.mangaData = data;


      for (let i=0;i<data.data.length;i++) {
        let tags = data.data[i]["attributes"]["tags"];
        for (let x=0;x<tags.length;x++) {
          let tag = tags[x]["attributes"]["name"]["en"] || Object.values(tags)[0];
          this.tagArray.push(tag);
        }
      }

      console.log(data);

      let descriptions = this.mangaData.data[0]["attributes"]["description"] ;
      let descLen = Object.keys(descriptions).length;
      let status = this.mangaData.data[0]["attributes"]["status"];
      let mangaYear = this.mangaData.data[0]["attributes"]["year"] ;
      let contentRating = this.mangaData.data[0]["attributes"]["contentRating"];
      for (let i=0; i<this.mangaData.data[0]["attributes"]["altTitles"].length;i++) {
        let titles = this.mangaData.data[0]["attributes"]["altTitles"] ;
        let alternative = titles[i];

        Object.entries(alternative).forEach(([key,value ]: any) => {
          this.alternativeTitles.push(value);
        })

      }
      this.raw_link = this.mangaData.data[0]["attributes"]["links"]["raw"];
      this.ebook_link = this.mangaData.data[0]["attributes"]["links"]["ebj"];



      if (descLen >= 1) {
        var desc = descriptions["en"] || Object.values(descriptions[0]) ;
        if (desc.length >= 700) {
          desc = desc.slice(0,700) + "...";
        }
      }else{
        alert("No description found");
      }


      let manga_id = this.mangaData.data[0]["id"];


      this.mangaInfoService.getMangaStatistics(manga_id).subscribe((data: any) => {
        const dist = data.statistics[manga_id]["rating"]["distribution"];
        this.sharedData.setDist(dist);

      })

        this.mangaInfoService.getMangaImageData(manga_id).subscribe((imageData: any) => {
          const filename = imageData.data[0].attributes.fileName || "Kein Bild";
          const imageUrl = `https://uploads.mangadex.org/covers/${manga_id}/${filename}`;
          const thumb = `https://uploads.mangadex.org/covers/${manga_id}/${filename}.512.jpg`;

          if (this.sharedData.lastSearch.length >= 50) {
            this.sharedData.lastSearch = this.sharedData.lastSearch.slice(0,100) + "...";

          }

          const newManga: Manga = {
            title: this.sharedData.lastSearch,
            description: desc,
            image:imageUrl,
            id:"",
            fileName: filename,
            stat: status,
            year: mangaYear,
            content: contentRating,
            chapter: "",
            rating: "",
            thumbnail: thumb,
          };
          this.mangaDetail.push(newManga);


        })


    });

  }




}
