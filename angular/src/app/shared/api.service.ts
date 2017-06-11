import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {

  constructor(private http: Http) {
    console.log('API ready');
  }

  getShows() {
    return this.http.get( environment.host + '/api/show/').map(res => res.json()).toPromise();
  }

  getShow(showId) {
    return this.http.get( environment.host + '/api/show/' + showId).map(res => res.json()).toPromise();
  }

  getSeasons(showId) {
    return this.http.get( environment.host + '/api/show/' + showId + '/season/').map(res => res.json()).toPromise();
  }

  getSeason(showId, seasonId) {
    return this.http.get( environment.host + '/api/show/' + showId + '/season/' + seasonId).map(res => res.json()).toPromise();
  }

  getEpisodes(showId, seasonId) {
    return this.http.get( environment.host + '/api/show/' + showId + '/season/' + seasonId + '/episode/').map(res => res.json()).toPromise();
  }

  getEpisode(showId, seasonId, episodeId) {
    return this.http.get( environment.host + '/api/show/' + showId + '/season/' + seasonId + '/episode/' + episodeId).map(res => res.json()).toPromise();
  }

  getCharacters() {
    return this.http.get( environment.host + '/api/characters/').map(res => res.json()).toPromise();
  }

}
