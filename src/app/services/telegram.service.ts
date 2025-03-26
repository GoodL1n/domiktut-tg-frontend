import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const TELEGRAM_API = `${environment?.apiUrl}/telegram-bot/`;

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  constructor(private httpClient: HttpClient) { }

  sendMessage(message: string) {
    return this.httpClient.post<string>(TELEGRAM_API + 'send', message, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
