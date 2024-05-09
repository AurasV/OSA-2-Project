from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)


# Routes
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/signin')
def signin():
    # Placeholder for sign-in page
    return render_template('sign-in.html')


@app.route('/register')
def signup():
    # Placeholder for sign-up page
    return render_template('register.html')


if __name__ == "__main__":
    app.run(debug=True)
