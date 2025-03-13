import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { House } from '../interfaces/house.interface';
import { environment } from '../../environments/environment';

// const WORDPRESS_INTEGRATION_API = `${environment.apiUrl}/wordpress-integration/`;

@Injectable({
  providedIn: 'root'
})
export class WordpressIntegrationService {

  constructor(private httpClient: HttpClient) { }

  // getPost(id: number): Observable<House[]> {
  //   return this.httpClient.get<House[]>(WORDPRESS_INTEGRATION_API + 'post');
  // }

  // get3Posts(): Observable<House[]> {
  //   return this.httpClient.get<House[]>(WORDPRESS_INTEGRATION_API + 'posts');
  // }
}
