let _ = require('lodash');

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { ActivatedRoute } from '@angular/router';

declare let cloud: any;
declare let draw: any;
declare let d3: any;
declare let Chart: any;

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {
  public show;
  public characterStats;

  public brandPrimary: string = '#20a8d8';
  public brandSuccess: string = '#4dbd74';
  public brandInfo: string = '#63c2de';
  public brandWarning: string = '#f8cb00';
  public brandDanger: string = '#f86c6b';


  // Pie
  //public pieChartLabels: string[] = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars', '6 stars', '7 stars', '8 stars', '9 stars', '10 stars'];
  //public pieChartData: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 61, 2];
  public pieChartType: string = 'pie';

  // lineChart4
  public lineChart4Data: Array<any> = [
    {
      data: [4, 18, 9, 17, 34, 22, 11, 3, 15, 12, 18, 9],
      label: 'Series A'
    }
  ];
  public lineChart4Labels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public lineChart4Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
        points: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: { point: { radius: 0 } },
    legend: {
      display: false
    }
  };
  public lineChart4Colours: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,255,255,.55)',
      borderWidth: 2
    }
  ];
  public lineChart4Legend: boolean = false;
  public lineChart4Type: string = 'line';


  // Line Chart: Correlation between review sentiment and rating
  public crrLineChartData: Array<any> = [
    {
      data: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      label: 'Normalized average sentiment (IMDb) per rating',
      pointRadius: 7
    },
    {
      data: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      label: 'Line of best fit (linear regression)',
      showLine: true,
      pointRadius: 0,
      fill: false
    }
  ];
  // labels (x axis): rating in stars (1,2,..10)
  public crrLineChartLabels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  public crrLineChartOptions: any = {
    showLines: false
  };
  public crrLineChartType: string = 'line';

  // Line Chart: Sentiment for specific characters (IMDb)
  public characterSentimentChartData: Array<any> = [{ data: _.range(0, 21).map(x => 0.1), label: "IMDb" }, { data: _.range(0, 21).map(x => 0.2), label: "Trakt.tv" }];
  public characterSentimentChartLabels: Array<any> = _.range(0, 21).map(x => "CharacterLabel" + x);
  public characterSentimentChartOptions: any = {
    maintainAspectRatio: true,
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: -1,
          suggestedMax: 1
        }
      }]
    }
  };
  public characterSentimentChartType: string = 'bar';


  // barChart2
  public barChart2Data: Array<any> = [
    {
      data: [4, 18, 9, 17, 34, 22, 11, 3, 15, 12, 18, 9],
      label: 'Series A'
    }
  ];
  public barChart2Labels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChart2Options: any = {
  };
  public barChart2Colours: Array<any> = [
    {
      backgroundColor: 'rgba(0,0,0,.2)',
      borderWidth: 0
    }
  ];
  public barChart2Legend: boolean = false;
  public barChart2Type: string = 'bar';

  // Viewers
  public viewersData: Array<any> = [
    {
      data: [2.5, 3.8, 4.9, 6.8, 6.8, 7.69],
      label: 'Mio. Viewers'
    }
  ];
  public viewersLabels: Array<any> = ['Season 1', 'Season 2', 'Season 3', 'Season 4', 'Season 5', 'Season 6'];
  public viewersOptions: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 0.6,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: true
    }
  };
  public viewersColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.3)',
      borderWidth: 0
    }
  ];
  public viewersLegend: boolean = false;
  public viewersType: string = 'bar';

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
    { data: [5, 7, 11, 6, 12, 10, 13, 13, 15, 8], label: 'IMDb' },
    { data: [3, 6, 4, 8, 6, 5, 6, 12, 18, 8], label: 'Trakt.tv' }
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
    { data: [6.5, 7.3, 7.8, 8.3, 8.0, 9.3], label: 'IMDb' },
    { data: [6.0, 7.9, 7.0, 9.3, 9.3, 9.5], label: 'Trakt.tv' }
  ];

  // reddit comments per seasons
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

  public redditDistributionData: any[] = [
    { data: [6.0, 7.9, 7.0, 9.3, 9.3, 9.5], label: 'Reddit Comments' }
  ];

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute, private _apiService: ApiService) {

    this._apiService.getShows().then(res => {
      console.log(res);

      this.radarChartData = [
        { data: [res[0].imdbUserReviewsCount, res[1].imdbUserReviewsCount, res[2].imdbUserReviewsCount, res[3].imdbUserReviewsCount], label: 'IMDb' },
        { data: [res[0].traktCommentCount, res[1].traktCommentCount, res[2].traktCommentCount, res[3].traktCommentCount], label: 'Trakt.tv' }
      ];
    });


    const id = route.params.map(p => p.id);
    id.subscribe(showId => {
      this._apiService.getShow(showId).then(res => {
        this.show = res;

        console.log(this.show);

        // Imdb Rating Distribution
        let labels = [];
        let imdbDistributionData = [];
        for (let property in this.show.imdbRatingDistribution) {
          if (this.show.imdbRatingDistribution.hasOwnProperty(property)) {
            labels.push(property);
            imdbDistributionData.push(this.show.imdbRatingDistribution[property]);
          }
        }

        let traktDistributionData = [];
        for (let property in this.show.traktRatingDistribution) {
          if (this.show.traktRatingDistribution.hasOwnProperty(property)) {
            labels.push(property);
            traktDistributionData.push(this.show.traktRatingDistribution[property]);
          }
        }
        //this.pieChartLabels = labels;
        //this.pieChartData = imdbDistributionData;
        this.ratingDistributionData = [
          { data: imdbDistributionData, label: 'IMDb' },
          { data: traktDistributionData, label: 'Trakt.tv' }
        ];

        // Average Imdb season rating
        let imdbSeasonAvgRating = [];
        let traktSeasonAvgRating = [];
        this.averageRatingLabels = [];
        for (let index in this.show.seasons) {
          imdbSeasonAvgRating.push(this.show.seasons[index].average_imdb_rating);
          traktSeasonAvgRating.push(this.show.seasons[index].average_trakt_rating);
          this.averageRatingLabels.push('Season ' + (parseInt(index) + 1));
        }
        this.cdr.detectChanges();

        this.averageRatingData = [
          { data: imdbSeasonAvgRating, label: 'IMDb' },
          { data: traktSeasonAvgRating, label: 'Trakt.tv' }
        ];

        // Reddit Distribution
        let redditComments = [];
        let redditDistributionLabels = [];
        for (let index in this.show.seasons) {
          redditComments.push(this.show.seasons[index].redditComment_count);
          this.redditDistributionLabels.push('Season ' + (parseInt(index) + 1));
        }
        this.cdr.detectChanges();
        this.redditDistributionData = [
          { data: redditComments, label: 'Reddit Comments' }
        ];

        let crrLineChartDataTempPoints = [];
        let crrLineChartDataTempLine = [];
        let intercept = this.show.imdbCorrelation.regr_coeff_intercept;
        let slope = this.show.imdbCorrelation.regr_coeff_slope;
        _.range(1, 11).map(x => {
          crrLineChartDataTempPoints.push(parseFloat(this.show.imdbCorrelation['v' + x]));
          crrLineChartDataTempLine.push(parseFloat(slope * x + intercept));
        })

        this.crrLineChartData = [
          {
            data: crrLineChartDataTempPoints,
            label: 'Normalized average sentiment (IMDb) per rating',
            pointRadius: 7
          },
          {
            data: crrLineChartDataTempLine,
            label: 'Line of best fit (linear regression)',
            showLine: true,
            pointRadius: 0,
            fill: false
          }
        ];



        // TODO crrLineChartData[0].data = ...

        // If the show is GoT get Character Stats
        if (this.show.id === 1) {
          this._apiService.getCharacters().then(res => {
            this.characterStats = res;

            let characterSentimentChartDataTemp = { imdb: [], reddit: [] };
            for (let index in this.characterStats) {
              characterSentimentChartDataTemp.imdb.push({ name: this.characterStats[index].name, data: [this.characterStats[index].imdb_sentimentScoreAvg] });
              characterSentimentChartDataTemp.reddit.push({ name: this.characterStats[index].name, data: [this.characterStats[index].redditTit_sentimentScoreAvg] });
            }
            let tempCharacterLabels = [];
            let tempImdbData = [];
            characterSentimentChartDataTemp.imdb.forEach(element => {
              tempCharacterLabels.push(element.name);
              tempImdbData.push(parseFloat(element.data));
            });
            let tempRedditData = [];
            characterSentimentChartDataTemp.reddit.forEach(element => {
              tempRedditData.push(parseFloat(element.data));
            });

            // TODO GW: Is it possible to resize a chart data array once it is initialized?
            // I could not make it work, therefore the size has to be known when initializing the data array for the chart.
            // -> // this.characterSentimentChartData.length = characterSentimentChartDataTemp.length;
            this.characterSentimentChartLabels = tempCharacterLabels;
            this.cdr.detectChanges();
            this.characterSentimentChartData = [
              { data: tempImdbData, label: "IMDb" },
              { data: tempRedditData, label: "Reddit" }
            ];
          });
        }
      });
    });

  }

  ngOnInit() { }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public barChartLegend: boolean = true;
  public lineChartType: string = 'bar';


  //Radar Chart
  public radarChartLabels: string[] = ['Game of Thrones', 'The Big Bang Theory', 'Criminal Minds', '13 Reasons Why'];

  public radarChartData: any = [
    { data: [65, 59, 90, 81], label: 'IMDb' },
    { data: [28, 48, 40, 19], label: 'Reddit' }
  ];
  public radarChartType: string = 'radar';
}
