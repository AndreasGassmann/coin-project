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

}
