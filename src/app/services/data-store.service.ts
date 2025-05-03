import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, take } from 'rxjs';
import { House } from '../interfaces/house.interface';
import { C } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  private _houses = new BehaviorSubject<House[]>([]);
  houses$ = this._houses.asObservable();

  private _allHouses = new BehaviorSubject<House[]>([]);
  allHouses$ = this._allHouses.asObservable();

  private _currentHouseId = new BehaviorSubject<number>(0);
  currentHouseId$ = this._currentHouseId.asObservable();

  private _currentHouse = new BehaviorSubject<House>({});
  currentHouse$ = this._currentHouse.asObservable();

  private _currentHouseImgs = new BehaviorSubject<string[]>([]);
  currentHouseImgs$ = this._currentHouseImgs.asObservable();

  private _cityId = new BehaviorSubject<string>('6');
  cityId$ = this._cityId.asObservable();

  constructor() { }

  setHouses(houses: House[]) {
    this._houses.next(houses);
  }

  setAllHouses(houses: House[]) {
    this._allHouses.next(houses);
  }

  setCurrentHouseId(id: number){
    this._currentHouseId.next(id);
  }

  setCurrentHouse(house: House){
    this._currentHouse.next(house);
  }

  setCurrentHouseImgs(img: string[]){
    this._currentHouseImgs.next(img);
  }

  setCityId(cityId: string){
    this._cityId.next(cityId);
  }

  updatedMainStore() {
    this.allHouses$.pipe(take(1)).subscribe(data => {
      this.setHouses(data);
    })
  }
}
