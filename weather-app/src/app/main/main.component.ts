import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  weather: any;

  constructor(private weatherService: WeatherService) {}

  getWeatherForCity(city: string) {
    this.weatherService.getWeather(city).subscribe(data => {
      this.weather = data;
    });
  }
}
