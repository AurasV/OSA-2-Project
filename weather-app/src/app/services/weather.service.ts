import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseUrl = 'http://localhost:5000/weather';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?city=${encodeURIComponent(city)}`);
  }

  getWeatherByIP(): Observable<any> {
    return this.http.get(`${this.baseUrl}/byip`);
  }
}
