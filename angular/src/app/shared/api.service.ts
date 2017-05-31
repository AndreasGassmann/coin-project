import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {

  constructor(private http: Http) {
    console.log('API ready');
  }

  getShows() {
    return this.http.get('http://localhost:3000/api/show/').map(res => res.json()).toPromise();
  }

  getShow(id) {
    return this.http.get('http://localhost:3000/api/show/' + id).map(res => res.json()).toPromise();
  }

}
