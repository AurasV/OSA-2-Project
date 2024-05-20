# OSA-2-Project

## Project Description
A simple To-do list made using Flask, CSS (Tailwind), HTML and JavaScript. The user can add modify and delete tasks. The tasks are stored in a SQLite database.
Global access is done using ngrok. The application can be accessed from any device connected to the same network as the host either way.

## Features
- Add Tasks
- Modify Tasks
- Delete Tasks
- Local Caching
- Login/Logout
- Dark Mode
- Exporting to CSV/XLSX
- Text to Speech
- Multithreading using Waitress
- Global Access using ngrok

## TO DO (Future Features)
- Add a calendar feature
- Add a reminder feature

## Installation and Running
1. Clone the repository
2. Install the required packages using `pip install -r requirements.txt`
3. To access the application globally you will need to set the environment variable `NGROK_AUTHTOKEN` to your auth token. You can get one by signing up on [ngrok](https://ngrok.com/). To add it in PyCharm go to `Run -> Edit Configurations -> Environment Variables` and add a new variable with the name `NGROK_AUTHTOKEN` and the value your auth token like so `NGROK_AUTHTOKEN=your-auth-token`
4. Run the application using `python app.py` or using the configuration you just created in PyCharm
5. Open the application in your browser at `http://127.0.0.1:5000`
6. App can also be accessed from the local network using the ip `http://<your--IPv4-local-ip>:5000`

## Libraries Used for Building and Testing
- blinker==1.8.2
- cachelib==0.9.0
- certifi==2024.2.2
- charset-normalizer==3.3.2
- click==8.1.7
- colorama==0.4.6
- Flask==3.0.3
- Flask-Caching==2.3.0
- Flask-Cors==4.0.1
- Flask-Login==0.6.3
- Flask-SQLAlchemy==3.1.1
- greenlet==3.0.3
- idna==3.7
- itsdangerous==2.2.0
- Jinja2==3.1.4
- MarkupSafe==2.1.5
- ngrok==1.2.0
- numpy==1.26.4
- pandas==2.2.2
- python-dateutil==2.9.0.post0
- pytz==2024.1
- requests==2.31.0
- six==1.16.0
- SpeechRecognition==3.10.4
- SQLAlchemy==2.0.30
- typing_extensions==4.11.0
- tzdata==2024.1
- urllib3==2.2.1
- waitress==3.0.0
- Werkzeug==3.0.3

## Contributors
- [Frimu Aurel-Viorel](https://github.com/AurasV)
- [Petre Maria-Teodora](https://github.com/730dora)