import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  _isLoading = new BehaviorSubject(false);
  isLoading$ = this._isLoading.asObservable();

  constructor() { }

  setIsLoading(value: boolean){
    this._isLoading.next(value);
  }
}
