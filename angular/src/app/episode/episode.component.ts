import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { ApiService } from "app/shared/api.service";

@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.scss']
})
export class EpisodeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private _apiService: ApiService) {
    const showId = route.params.map(p => p.id);
    const seasonId = route.params.map(p => p.seasonId);
    const episodeId = route.params.map(p => p.episodeId);

    Observable.combineLatest(
      showId,
      seasonId,
      episodeId
    ).subscribe(
      data => {
        console.log(data);
        this._apiService.getEpisode(data[0], data[1], data[2]).then(res => {
          console.log(res);
        });
      },
      err => console.error(err)
    );
  }

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

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
