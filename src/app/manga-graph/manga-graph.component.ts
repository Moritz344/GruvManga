import { Component } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-manga-graph',
  imports: [CanvasJSAngularChartsModule],
  templateUrl: './manga-graph.component.html',
  styleUrl: './manga-graph.component.css'
})

export class MangaGraphComponent {

  constructor(public sharedData: SharedDataService) {}


  dataPoints: { label: string; y: number }[] = [];

  chartOptions: any | null;

  updateChart() {
    this.chartOptions.data[0].dataPoints = this.dataPoints;
    this.chartOptions = { ...this.chartOptions };
  }

  ngOnInit() {
    this.sharedData.dist$.subscribe(dist => {
    if (dist && Object.keys(dist).length) {
      this.dataPoints = Object.entries(dist).map(([rating, count]) => ({
        label: rating,
        y: count,
        color: "#98971a",
      }));
      this.updateChart();
    }
  });

    this.chartOptions = {
      animationEnabled: true,
      width: 1400,
      height: 300,
      backgroundColor: "#242424",
      title: {
        text: "Score Distribution",
        fontColor: "white",
      },
      axisY: {
        title: "Number of Ratings",
        titleFontColor: "white",
        labelFontColor: "white",
        gridThickness: 0,
      },
      axisX: {
        title: "Rating value",
        interval: 1,
        titleFontColor: "white",
        labelFontColor: "white",
        gridThickness: 0,
        lineThickness:0,

      },
      data: [{
        type: "line",
        color: "#98971a",
        dataPoints: this.dataPoints
      }]
    };
  }
}
