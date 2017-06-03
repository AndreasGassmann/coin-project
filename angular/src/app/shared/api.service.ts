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

  getShow(id) {
    return this.http.get( environment.host + '/api/show/' + id).map(res => res.json()).toPromise();
  }

}
