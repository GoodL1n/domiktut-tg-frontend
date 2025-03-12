import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { House } from '../interfaces/house.interface';

const WORDPRESS_INTEGRATION_API = 'http://localhost:3000/wordpress-integration/';

@Injectable({
  providedIn: 'root'
})
export class WordpressIntegrationService {

  constructor(private httpClient: HttpClient) { }

  get3Posts(): Observable<House[]>{
    return this.httpClient.get<House[]>(WORDPRESS_INTEGRATION_API + 'posts');
  }
}
