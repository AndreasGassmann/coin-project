import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { ApiService } from "app/shared/api.service";

declare let cloud: any;
declare let draw: any;
declare let d3: any;
declare let Chart: any;

@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.scss']
})
export class EpisodeComponent implements OnInit {

  public sentiment_list = [];

  public episode:any;
  public season:any;
  public show:any;

  constructor(private route: ActivatedRoute, private _apiService: ApiService) {
    console.log(route.params);
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
          this.episode = res;

          this._apiService.getWordCloudDataForEpisode(res.id).then(res => {
            this.sentiment_list = res;
            console.log(res);
            this.setFilter('all');
          })

          // Imdb Rating Distribution
          let imdbDistributionData = [];
          for (let property in this.episode.ratingDistribution) {
            if (this.episode.ratingDistribution.hasOwnProperty(property)) {
              imdbDistributionData.push(this.episode.ratingDistribution[property]);
            }
          }

          let traktDistributionData = [];
          for (let property in this.episode.traktRatingDistribution) {
            if (this.episode.traktRatingDistribution.hasOwnProperty(property)) {
              traktDistributionData.push(this.episode.traktRatingDistribution[property]);
            }
          }

          this.ratingDistributionData = [
            {data: imdbDistributionData, label: 'IMDb'},
            {data: traktDistributionData, label: 'Trakt.tv'}
          ];

          // TODO: Use Trakt data which is not there yet
        });
        this._apiService.getSeason(data[0], data[1]).then(res => {
          this.season = res;
        });
        this._apiService.getShow(data[0]).then(res => {
          this.show = res;
        });
      },
      err => console.error(err)
    );
  }

  ngOnInit() {
    this.setFilter('all');
  }

  private drawWordCloud(data) {

    let layout = cloud()
      .size([1000, 1000])
      .words(data)
      .padding(2)
      .rotate(function () {
        //console.log(~~(Math.random() * 2) * 90);
        return 0;
      })
      .font("Impact")
      .fontSize(function (d) {
        return d.size;
      })
      .on("end", draw);


    layout.start();



    var fill = d3.scale.category20();

    function draw(words) {
      d3.select("svg").selectAll("*").remove();
      d3.select("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function (d) {
          return d.size + "px";
        })
        .style("font-family", "Impact")
        .style("fill", function (d, i) {
          return d.color;
        })
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) {
          return d.text;
        });
    }

  }

  public setFilter(f) {

    let colorFn = function (sentiment) {
      if (sentiment > 6) {
        return '1FBF00';
      } else if (sentiment <= 6 && sentiment > 5) {
        return '4B9402';

      } else if (sentiment <= 5 && sentiment > 4) {
        return '4B9402';

      } else if (sentiment <= 4 && sentiment > 3) {
        return 'A33F08';
      } else if (sentiment <= 3 && sentiment > 2) {
        return '617F04';

      } else if (sentiment <= 2 && sentiment > 1) {
        return 'B92A09';
      } else if (sentiment <= 1 && sentiment > 0) {
        return 'CF150A';
      } else if (sentiment <= 0 && sentiment > -1) {
        return 'E5000C';
      } else {
        return '000000';
      }
    };

    let data = this.sentiment_list.map(e => {
      return {
        text: e.text,
        size: e.size,
        color: colorFn(e.avgSentiment),
        sentiment: e.avgSentiment
      }
    });

    let maxSize = 0;
    let minSize = Infinity;
    // normalize size
    data.forEach(d => {
      if (d.size > maxSize) maxSize = d.size;
      if (d.size < minSize) minSize = d.size;
    });

    let factor = 1;
    console.log(maxSize);
    if (maxSize < 100) {
      console.log('smaller than 50');
      factor = 100 / maxSize;
      data = data.map(d => {
        d.size = d.size * factor;
        return d;
      });
    }

    console.log(data);

    if (f === 'pos') {
      data = data.filter(e => e.sentiment > 4);
    } else if (f === 'neg') {
      data = data.filter(e => e.sentiment <= 4);
    }

    this.drawWordCloud(data);

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
