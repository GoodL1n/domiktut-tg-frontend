import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { House } from '../interfaces/house.interface';
import { environment } from '../../environments/environment';
import { Filter } from '../interfaces/filter.interface';
import { DataStoreService } from './data-store.service';

const WORDPRESS_INTEGRATION_API = `${environment?.apiUrl}/wordpress-integration/`;

@Injectable({
  providedIn: 'root'
})
export class WordpressIntegrationService {

  cityId!: string;

  constructor(private httpClient: HttpClient,
    private dataStoreService: DataStoreService
  ) {
    this.dataStoreService.cityId$.pipe(take(1)).subscribe(cityId => {
      console.log('взяли из стора cityId', cityId);
      this.cityId = cityId;
    })
  }

  getHouses(): Observable<House[]> {
    console.log('cityId', this.cityId);
    return this.httpClient.get<House[]>(WORDPRESS_INTEGRATION_API, { params: { 'cityId': this.cityId } });
  }

  getHousesByFilter(filterData: Filter): Observable<House[]> {
    console.log('filterData', filterData)
    let httpParams = new HttpParams()
      .set('cityId', this.cityId);

    if (filterData.dateOfArrival && filterData.dateOfDeparture) {
      httpParams = httpParams.set('dateOfArrival', filterData.dateOfArrival);
      httpParams = httpParams.set('dateOfDeparture', filterData.dateOfDeparture);
    }
    if (filterData.number_of_bedrooms) httpParams = httpParams.set('number_of_bedrooms', filterData.number_of_bedrooms);
    if (filterData.number_of_beds) httpParams = httpParams.set('number_of_beds', filterData.number_of_beds);
    if (filterData.number_of_people) httpParams = httpParams.set('number_of_people', filterData.number_of_people);
    if (filterData.type_of_house) httpParams = httpParams.set('type_of_house', filterData.type_of_house);

    return this.httpClient.get<House[]>(WORDPRESS_INTEGRATION_API + 'filters', { params: httpParams });
  }

  getHouseById(id: number) {
    return this.httpClient.get<House[]>(WORDPRESS_INTEGRATION_API + `house/${id}`);
  }
}
