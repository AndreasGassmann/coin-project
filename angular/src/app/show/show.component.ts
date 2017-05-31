import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { ActivatedRoute } from '@angular/router';

declare let cloud: any;
declare let draw: any;
declare let d3: any;

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {
  public show;

  public brandPrimary: string = '#20a8d8';
  public brandSuccess: string = '#4dbd74';
  public brandInfo: string = '#63c2de';
  public brandWarning: string = '#f8cb00';
  public brandDanger: string = '#f86c6b';


  // Pie
  public pieChartLabels: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  public pieChartData: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 61, 2];
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


  // barChart2
  public barChart2Data: Array<any> = [
    {
      data: [4, 18, 9, 17, 34, 22, 11, 3, 15, 12, 18, 9],
      label: 'Series A'
    }
  ];
  public barChart2Labels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChart2Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 0.6,
      }],
      yAxes: [{
        display: false,
        ticks: {
          beginAtZero: true,
        }
      }]
    },
    legend: {
      display: false
    }
  };
  public barChart2Colours: Array<any> = [
    {
      backgroundColor: 'rgba(0,0,0,.2)',
      borderWidth: 0
    }
  ];
  public barChart2Legend: boolean = false;
  public barChart2Type: string = 'bar';

  // lineChart5
  public lineChart5Data: Array<{ data: any[], label: string }> = [
    {
      data: new Array(500),
      label: 'Series A'
    }
  ];
  //public lineChart5Labels: Array<any> = ['January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart5Labels: Array<any> = new Array(500);
  public lineChart5Options: any = {
    animation: {
      duration: 0
    },
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
  public lineChart5Info: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandInfo,
      borderWidth: 2
    }
  ];
  public lineChart5Success: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandInfo,
      borderWidth: 2
    }
  ];
  public lineChart5Warning: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandWarning,
      borderWidth: 2
    }
  ];
  public lineChart5Legend: boolean = false;
  public lineChart5Type: string = 'line';

  // barChart1
  public barChart1Data:Array<any> = [
    {
      data: [2.5, 3.8, 4.9, 6.8, 6.8, 7.69],
      label: 'Mio. Viewers'
    }
  ];
  public barChart1Labels:Array<any> = ['Season 1', 'Season 2', 'Season 3', 'Season 4', 'Season 5', 'Season 6'];
  public barChart1Options:any = {
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
      display: false
    }
  };
  public barChart1Colours:Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.3)',
      borderWidth: 0
    }
  ];
  public barChart1Legend:boolean = false;
  public barChart1Type:string = 'bar';

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute, private _apiService: ApiService) {

    setInterval(() => {
      let label = this.lineChart5Data[0].label;
      let lineData = this.lineChart5Data[0].data.slice(1);
      let last = lineData[lineData.length - 1];
      if (!last) {
        last = 0;
      }
      let rand = (Math.round(Math.random() * 5) - 2.5);
      lineData.push(last + rand);
      this.lineChart5Data = [{ data: lineData, label: label }];
    }, 50);
    //this.cdr.detectChanges();

    const id = route.params.map(p => p.id);
    id.subscribe(showId => {
      this._apiService.getShow(showId).then(res => {
        this.show = res;

        console.log(this.show);
        let labels = [];
        let data = [];
        for (let property in this.show.rating) {
          if (this.show.rating.hasOwnProperty(property)) {
            console.log('pushing');
            labels.push(property);
            data.push(this.show.rating[property]);
          }
        }
        this.pieChartLabels = labels;
        this.pieChartData = data;
      })
    })











  }

  ngOnInit() {

    this.setFilter('all');

  }

  private drawWordCloud(data) {
    let layout = cloud()
      .size([500, 500])
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
    }

    var words = [
      'about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are', 'as', 'at', 'be',
      'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 'can',
      'come', 'could', 'did', 'do', 'each', 'for', 'from', 'get', 'got', 'has', 'had',
      'he', 'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into',
      'is', 'it', 'like', 'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must',
      'my', 'never', 'now', 'of', 'on', 'only', 'or', 'other', 'our', 'out', 'over',
      'said', 'same', 'see', 'should', 'since', 'some', 'still', 'such', 'take', 'than',
      'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those',
      'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were',
      'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your', 'a', 'i'];

    var frequency_list = [{ "text": "episode", "size": 43.7, "avgSentiment": 8.289244851258582 }, { "text": "season", "size": 23.17, "avgSentiment": 9.486404833836858 }, { "text": "not", "size": 21.33, "avgSentiment": 2.857946554149086 }, { "text": "she", "size": 18.64, "avgSentiment": -0.013412017167381975 }, { "text": "so", "size": 18.56, "avgSentiment": 4.308189655172414 }, { "text": "one", "size": 18, "avgSentiment": 5.613333333333333 }, { "text": "just", "size": 14.82, "avgSentiment": 2.7530364372469633 }, { "text": "its", "size": 14.38, "avgSentiment": 4.28442280945758 }, { "text": "show", "size": 14.3, "avgSentiment": 4.277622377622378 }, { "text": "will", "size": 14.18, "avgSentiment": 3.3758815232722146 }, { "text": "jon", "size": 11.97, "avgSentiment": 2.500417710944027 }, { "text": "scene", "size": 10.98, "avgSentiment": 8.693078324225866 }, { "text": "great", "size": 10.91, "avgSentiment": 14.112740604949588 }, { "text": "really", "size": 10.58, "avgSentiment": 11.173913043478262 }, { "text": "when", "size": 10.07, "avgSentiment": 2.17974180734856 }, { "text": "best", "size": 10.02, "avgSentiment": 11.221556886227544 }, { "text": "tyrion", "size": 9.87, "avgSentiment": 5.256332320162107 }, { "text": "no", "size": 9.53, "avgSentiment": -1.7775445960125917 }, { "text": "even", "size": 9.39, "avgSentiment": 2.8423855165069223 }, { "text": "good", "size": 9.38, "avgSentiment": 8.513859275053305 }, { "text": "game", "size": 9.27, "avgSentiment": 7.856526429341963 }, { "text": "time", "size": 9.24, "avgSentiment": 4.745670995670996 }, { "text": "story", "size": 8.98, "avgSentiment": 6.465478841870824 }, { "text": "arya", "size": 8.9, "avgSentiment": 2.593258426966292 }, { "text": "thrones", "size": 8.45, "avgSentiment": 9.23076923076923 }, { "text": "characters", "size": 8.3, "avgSentiment": 6.365060240963856 }, { "text": "sansa", "size": 7.97, "avgSentiment": 2.0476787954830615 }, { "text": "episodes", "size": 7.73, "avgSentiment": 8.961190168175937 }, { "text": "last", "size": 7.54, "avgSentiment": 7.183023872679045 }, { "text": "first", "size": 7.48, "avgSentiment": 7.71524064171123 }, { "text": "battle", "size": 7.13, "avgSentiment": 3.44179523141655 }, { "text": "character", "size": 7.02, "avgSentiment": 6.354700854700854 }, { "text": "series", "size": 6.93, "avgSentiment": 6.331890331890332 }, { "text": "snow", "size": 6.82, "avgSentiment": 2.6114369501466275 }, { "text": "daenerys", "size": 6.74, "avgSentiment": 3.7700296735905043 }, { "text": "scenes", "size": 6.51, "avgSentiment": 9.009216589861751 }, { "text": "back", "size": 6.17, "avgSentiment": 5.985413290113452 }, { "text": "going", "size": 6.13, "avgSentiment": 5.137030995106036 }, { "text": "-", "size": 6.01, "avgSentiment": 3.0399334442595674 }, { "text": "end", "size": 5.87, "avgSentiment": 5.318568994889268 }, { "text": "stark", "size": 5.78, "avgSentiment": 3.7698961937716264 }, { "text": "watch", "size": 5.73, "avgSentiment": 3.4485165794066317 }, { "text": "finally", "size": 5.64, "avgSentiment": 6.925531914893617 }, { "text": "two", "size": 5.47, "avgSentiment": 6.371115173674589 }, { "text": "10", "size": 5.37, "avgSentiment": 7.804469273743017 }, { "text": "dont", "size": 5.36, "avgSentiment": 1.5932835820895523 }, { "text": "cersei", "size": 5.34, "avgSentiment": 2.640449438202247 }, { "text": "people", "size": 5.28, "avgSentiment": 1.4223484848484849 }, { "text": "again", "size": 5.28, "avgSentiment": 6.910984848484849 }, { "text": "next", "size": 5.23, "avgSentiment": 6.491395793499044 }, { "text": "off", "size": 5.18, "avgSentiment": 4.642857142857143 }];
    let data = frequency_list.map(e => {
      return {
        text: e.text,
        size: e.size,
        color: colorFn(e.avgSentiment),
        sentiment: e.avgSentiment
      }
    });

    data = data.filter(e => {
      return words.indexOf(e.text) === -1;
    });

    if (f === 'pos') {
      data = data.filter(e => e.sentiment > 4);
    } else if (f === 'neg') {
      data = data.filter(e => e.sentiment <= 4);
    }

    this.drawWordCloud(data);

  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}