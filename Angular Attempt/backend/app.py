import os
import threading
import speech_recognition as sr
import requests
from flask import Flask, request, jsonify
from flask_caching import Cache
from flask_cors import CORS

app = Flask(__name__)
# Allow CORS for all domains on all routes
CORS(app, resources={r"/*": {"origins": "*"}})

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

API_KEY = os.getenv('OPENWEATHER_API_KEY', 'default_api_key')


def fetch_weather(city):
    print(API_KEY)
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric'
    print(url)
    response = requests.get(url)
    if response.status_code == 200:
        print("responded")
        data = response.json()
        return {
            'city': city,
            'temperature': data['main']['temp'],
            'description': data['weather'][0]['description']
        }
    else:
        return {'error': 'Failed to fetch weather data'}


def recognize_city():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Say the city name:")
        audio = recognizer.listen(source)

    try:
        return recognizer.recognize_sphinx(audio)
    except (sr.UnknownValueError, sr.RequestError) as e:
        return {'error': str(e)}


@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    print(city)
    voice_input = request.args.get('voice')
    print(voice_input)

    if voice_input is not None:
        city = recognize_city()
        if 'error' in city:
            return jsonify(city), 400

    if not city:
        return jsonify({'error': 'City parameter is missing'}), 400

    weather_data = fetch_weather(city)
    if 'error' in weather_data:
        return jsonify(weather_data), 500

    return jsonify(weather_data)


@app.route('/weather/byip', methods=['GET'])
def get_weather_by_ip():
    ip = request.remote_addr
    print("ip", ip)
    if not ip:
        ip = request.remote_addr
    response = requests.get(f'http://ip-api.com/json/{ip}')
    data = response.json()
    city = data['city']
    weather_data = fetch_weather(city)
    return jsonify(weather_data)


if __name__ == '__main__':
    app.run(debug=True)
