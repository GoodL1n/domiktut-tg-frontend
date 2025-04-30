import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { distinctUntilChanged, Observable, take } from 'rxjs';
import { House } from '../interfaces/house.interface';
import { environment } from '../../environments/environment';
import { Filter } from '../interfaces/filter.interface';
import { DataStoreService } from './data-store.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const WORDPRESS_INTEGRATION_API = `${environment?.apiUrl}/wordpress-integration/`;

@Injectable({
  providedIn: 'root'
})
export class WordpressIntegrationService {

  cityId!: string;

  constructor(private httpClient: HttpClient,
    private dataStoreService: DataStoreService
  ) {
    this.dataStoreService.cityId$.pipe(distinctUntilChanged()).subscribe(cityId => {
      console.log('взяли из стора cityId', cityId);
      this.cityId = cityId;
    })
  }

  getHouses(): Observable<House[]> {
    console.log('cityId', this.cityId);
    return this.httpClient.get<House[]>(WORDPRESS_INTEGRATION_API, { params: { 'cityId': this.cityId } });
  }

  getHousesByFilter(filterData: Partial<Filter>): Observable<House[]> {
    let httpParams = new HttpParams()
      .set('cityId', this.cityId);

    if (filterData.date_of_arrival && filterData.date_of_departure) {
      httpParams = httpParams.set('date_of_arrival', filterData.date_of_arrival);
      httpParams = httpParams.set('date_of_departure', filterData.date_of_departure);
    }
    if (filterData.number_of_bedrooms) httpParams = httpParams.set('number_of_bedrooms', filterData.number_of_bedrooms);
    if (filterData.number_of_beds) httpParams = httpParams.set('number_of_beds', filterData.number_of_beds);
    if (filterData.number_of_people) httpParams = httpParams.set('number_of_people', filterData.number_of_people);
    if (filterData.type_of_house) httpParams = httpParams.set('type_of_house', filterData.type_of_house);
    if (filterData.min_price) httpParams = httpParams.set('min_price', filterData.min_price);
    if (filterData.max_price) httpParams = httpParams.set('max_price', filterData.max_price);

    return this.httpClient.get<House[]>(WORDPRESS_INTEGRATION_API + 'filters', { params: httpParams });
  }

  getHouseById(id: number) {
    return this.httpClient.get<House[]>(WORDPRESS_INTEGRATION_API + `house/${id}`);
  }

  getImagesUrl(postsId: string, limit?: number) {
    let httpParams = new HttpParams()
      .set('postsId', postsId);

    if (limit) httpParams = httpParams.set('limit', limit);

    return this.httpClient.get(WORDPRESS_INTEGRATION_API + 'imgs', { params: httpParams })
  }
}
