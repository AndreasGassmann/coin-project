import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { ApiService } from "../shared/api.service";

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss']
})
export class SeasonComponent implements OnInit {

  public season: any;
  public show: any;

  // Rating Distribution
  public ratingDistributionOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  public ratingDistributionColors: Array<any> = [
    { // yellow
      backgroundColor: 'rgba(248, 203, 0, 0.75)',
      borderColor: 'rgba(211,165,0,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // red
      backgroundColor: 'rgba(248,108,107,0.75)',
      borderColor: 'rgba(196,101,101,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public ratingDistributionLabels: string[] = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars', '6 stars', '7 stars', '8 stars', '9 stars', '10 stars'];
  public barChartType: string = 'bar';
  public ratingDistributionLegend: boolean = true;

  public ratingDistributionData: any[] = [
    {data: [5, 7, 11, 6, 12, 10, 13, 13, 15, 8], label: 'IMDb'},
    {data: [3, 9, 14, 9, 6, 5, 18, 10, 18, 8], label: 'Trakt.tv'}
  ];

  // Average Rating
  public averageRatingOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  public averageRatingColors: Array<any> = [
    { // yellow
      backgroundColor: 'rgba(248, 203, 0, 0.75)',
      borderColor: 'rgba(211,165,0,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // red
      backgroundColor: 'rgba(248,108,107,0.75)',
      borderColor: 'rgba(196,101,101,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public averageRatingLabels: string[] = [];
  public averageRatingLegend: boolean = true;

  public averageRatingData: any[] = [
    {data: [6.5, 7.3, 7.8, 8.3, 8.0, 9.3, 7.8, 8.3, 8.0, 9.3], label: 'IMDb'},
    {data: [6.0, 7.9, 7.0, 9.3, 9.3, 9.5, 6.5, 7.3, 7.8, 9.8], label: 'Trakt.tv'}
  ];

  // reddit comments per episode
  public redditDistributionOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,

  };
  public redditDistributionColors: Array<any> = [
    { // blue
      backgroundColor: 'rgba(122, 174, 255, 0.75)',
    }
  ];
  public redditDistributionLabels: string[] = [];
  public redditDistributionLegend: boolean = true;
  public lineChartType: string = 'bar';

  public redditDistributionData: any[] = [
    {data: [6.0, 7.9, 7.0, 9.3, 9.3, 9.5], label: 'Reddit Comments'}
  ];

  public barChartLegend: boolean = true;

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  // barChart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['George W Bush', 'Ed Sheeran', 'Person XY', 'Person ABC', 'Person R', 'Person W', 'Person X'];
  public barChartType2: string = 'bar';
  public barChartLegend2: boolean = true;

  public barChartData: any[] = [
    {data: [9, 5, 8, 8, 6, 5, 4], label: 'Actual Rating of the episode'},
    {data: [8, 8, 4, 9, 8, 7, 9], label: 'Average Rating of the season'}
  ];

  constructor(private route: ActivatedRoute, private _apiService: ApiService) {
    const showId = route.params.map(p => p.id);
    const seasonId = route.params.map(p => p.seasonId);

    Observable.combineLatest(
      showId,
      seasonId
    ).subscribe(
      data => {
        this._apiService.getSeason(data[0], data[1]).then(res => {
          this.season = res;

          // Imdb Rating Distribution
          let imdbDistributionData = [];
          for (let property in this.season.imdbRatingDistribution) {
            if (this.season.imdbRatingDistribution.hasOwnProperty(property)) {
              imdbDistributionData.push(this.season.imdbRatingDistribution[property]);
            }
          }
          this.ratingDistributionData = [
            {data: imdbDistributionData, label: 'IMDb'},
            {data: [3, 9, 14, 9, 6, 5, 18, 10, 18, 8], label: 'Trakt.tv'}
          ];


          // Average Imdb season rating
          let imdbSeasonAvgRating = [];
          for (let index in this.season.episodes){
            imdbSeasonAvgRating.push(this.season.episodes[index].imdbRating);
            this.averageRatingLabels.push('Episode ' + (parseInt(index)+1));
          }
          this.averageRatingData = [
            {data: imdbSeasonAvgRating, label: 'IMDb'},
            {data: [6.0, 7.9, 7.0, 9.3, 9.3, 9.5], label: 'Trakt.tv'}
          ];
          // TODO: Also use Trakt data which is not there yet

          // Reddit Distribution
          let redditComments = [];
          for (let index in this.season.episodes){
            redditComments.push(this.season.episodes[index].redditComment_count);
            this.redditDistributionLabels.push('Episode ' + (parseInt(index)+1));
          }
          this.redditDistributionData = [
            {data: redditComments, label: 'Reddit Comments'}
          ];
        });
        this._apiService.getShow(data[0]).then(res => {
          this.show = res;
        });
      },
      err => console.error(err)
    );
  }

  ngOnInit() {
  }



}
