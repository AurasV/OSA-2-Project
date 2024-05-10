from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SECRET_KEY'] = 'your_secret_key_here'
db = SQLAlchemy(app)
login_manager = LoginManager(app)


# Define the User model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)


# User loader function required by Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# Routes
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            flash('You have been successfully logged in!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid email or password', 'error')

    return render_template('sign-in.html')


@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    else:
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm-password']

        if password != confirm_password:
            return jsonify({'success': False, 'message': 'Passwords do not match'})

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'success': False, 'message': 'Email already exists'})

        # Hash the password before storing it
        password_hash = generate_password_hash(password)

        new_user = User(email=email, password_hash=password_hash)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Account created successfully! You can now log in.'})


@app.route('/delete_all_users', methods=['GET'])
def delete_all_users():
    try:
        db.session.query(User).delete()
        db.session.commit()
    except Exception as e:
        db.session.rollback()

    return redirect(url_for('index'))


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('index'))


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
