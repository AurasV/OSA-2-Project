// header.component.ts
import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatToolbarModule, MatInputModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  locationWeather: any;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.weatherService.getWeatherByIP().subscribe(data => {
      this.locationWeather = data;
    });
  }

  searchWeather(city: string) {
    this.weatherService.getWeather(city).subscribe(data => {
      this.locationWeather = data;
    });
  }

  startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition() as any; // Cast to any to bypass type issues
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = (event: any) => { // Use any to handle the event
            const city = event.results[0][0].transcript;
            console.log(`Recognized: ${city}`);
            this.searchWeather(city);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event);
        };
    } else {
        console.error('Speech recognition not supported in this browser.');
    }
  }
}
