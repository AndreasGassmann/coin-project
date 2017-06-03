import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss']
})
export class SeasonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

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
      borderColor: 'rgba(196),101,101,1)',
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
      borderColor: 'rgba(196),101,101,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public averageRatingLabels: string[] = ['Episode 1', 'Episode 2', 'Episode 3', 'Episode 4', 'Episode 5', 'Episode 6','Episode 7', 'Episode 8', 'Episode 9', 'Episode 10'];
  //public barChartType: string = 'bar';
  public averageRatingLegend: boolean = true;

  public averageRatingData: any[] = [
    {data: [6.5, 7.3, 7.8, 8.3, 8.0, 9.3, 7.8, 8.3, 8.0, 9.3], label: 'IMDb'},
    {data: [6.0, 7.9, 7.0, 9.3, 9.3, 9.5, 6.5, 7.3, 7.8, 9.8], label: 'Trakt.tv'}
  ];

  public show = {
    'id': 1,
    'name': 'Game of Thrones',
    'image': "http://thetvdb.com/banners/fanart/original/121361-15.jpg",
    'titleimage': "https://red.elbenwald.de/media/image/3a/49/87/game-of-thrones_cat.jpg",
    'episodes': 70,
    'viewers': 51301,
    'rating': {
      '1': 5,
      '2': 57,
      '3': 72,
      '4': 322,
      '5': 263,
      '6': 886,
      '7': 1201,
      '8': 2200,
      '9': 2301,
      '10': 1900
    },
    'seasons': [{
      id: 1,
      episodes: [{
        id: 1,
        name: 'Test'
      }, {
        id: 2,
        name: 'Test'
      }, {
        id: 3,
        name: 'Test'
      }, {
        id: 4,
        name: 'Test'
      }, {
        id: 5,
        name: 'Test'
      },
        {
          id: 6,
          name: 'Test'
        }, {
          id: 7,
          name: 'Test'
        }, {
          id: 8,
          name: 'Test'
        }, {
          id: 9,
          name: 'Test'
        }, {
          id: 10,
          name: 'Test'
        }]
    }, {
      id: 2,
      episodes: [{
        id: 1,
        name: 'Test'
      }, {
        id: 2,
        name: 'Test'
      }, {
        id: 3,
        name: 'Test'
      }, {
        id: 4,
        name: 'Test'
      }, {
        id: 5,
        name: 'Test'
      }]
    },{
      id: 3,
      episodes: [{
        id: 1,
        name: 'Test'
      }, {
        id: 2,
        name: 'Test'
      }, {
        id: 3,
        name: 'Test'
      }, {
        id: 4,
        name: 'Test'
      }, {
        id: 5,
        name: 'Test'
      }]
    },{
      id: 4,
      episodes: [{
        id: 1,
        name: 'Test'
      }, {
        id: 2,
        name: 'Test'
      }, {
        id: 3,
        name: 'Test'
      }, {
        id: 4,
        name: 'Test'
      }, {
        id: 5,
        name: 'Test'
      }]
    },{
      id: 5,
      episodes: [{
        id: 1,
        name: 'Test'
      }, {
        id: 2,
        name: 'Test'
      }, {
        id: 3,
        name: 'Test'
      }, {
        id: 4,
        name: 'Test'
      }, {
        id: 5,
        name: 'Test'
      }]
    },{
      id: 6,
      episodes: [{
        id: 1,
        name: 'Test'
      }, {
        id: 2,
        name: 'Test'
      }, {
        id: 3,
        name: 'Test'
      }, {
        id: 4,
        name: 'Test'
      }, {
        id: 5,
        name: 'Test'
      }]
    }]
  };

  public barChartLegend: boolean = true;

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
