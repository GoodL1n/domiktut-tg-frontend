import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TelegramUser } from '../interfaces/tg-user.interface';
import { BehaviorSubject, concatMap, filter, Observable } from 'rxjs';
import { U } from '@angular/cdk/keycodes';

const TGUSER_API = `${environment?.apiUrl}/tg-user/`;

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  private _username = new BehaviorSubject<string>('');
  username$ = this._username.asObservable();

  private _userFavourites = new BehaviorSubject<TelegramUser>({});
  userFavourites$ = this._userFavourites.asObservable();

  constructor(private httpClient: HttpClient) { }

  getUserFavourites(username: string): Observable<TelegramUser> {
    return this.httpClient.post<TelegramUser>(TGUSER_API, { username: username });
  }

  addNewPostIdUser(post_id: number): Observable<TelegramUser> {
    return this.username$.pipe(
      filter(username => !!username),
      concatMap((username) => this.httpClient.post<TelegramUser>(TGUSER_API + 'new', { username, post_id }))
    )
  }

  deletePostIdUser(post_id: number): Observable<TelegramUser> {
    return this.username$.pipe(
      filter(username => !!username),
      concatMap((username) => this.httpClient.post<TelegramUser>(TGUSER_API + 'delete', { username, post_id }))
    )
  }

  setUsername(username: string) {
    this._username.next(username);
  }

  setUserFavourites(telegramUser: TelegramUser) {
    this._userFavourites.next(telegramUser);
  }
}
