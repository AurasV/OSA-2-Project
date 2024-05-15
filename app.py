# app.py
import json
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

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


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    task = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(20), nullable=False)


@app.route('/')
def index():
    return render_template('index.html')


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


@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            flash('You have been successfully logged in!', 'success')

            # Retrieve tasks from the database
            tasks = Task.query.filter_by(user_id=user.id).all()
            stored_tasks = {}
            for task in tasks:
                stored_tasks[str(task.id)] = {'task': task.task, 'type': task.type}
            # Update local storage
            response = redirect(url_for('index'))
            response.set_cookie('tasks', json.dumps(stored_tasks))

            # Redirect user to the main page
            return response
        else:
            flash('Invalid email or password', 'error')

    return render_template('sign-in.html')


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route('/get_tasks', methods=['GET'])
@login_required
def get_tasks():
    user_id = current_user.id
    tasks = Task.query.filter_by(user_id=user_id).all()
    task_list = [{'id': task.id, 'task': task.task, 'type': task.type} for task in tasks]
    return jsonify({'success': True, 'tasks': task_list})


@app.route('/add_task', methods=['POST'])
@login_required
def add_task():
    task_text = request.form['task']
    task_type = request.form['type']
    user_id = current_user.id

    # Save task to the database
    new_task = Task(user_id=user_id, task=task_text, type=task_type)
    db.session.add(new_task)
    db.session.commit()

    # Update local storage
    stored_tasks = json.loads(request.cookies.get('tasks', '{}'))
    stored_tasks[str(new_task.id)] = {'task': task_text, 'type': task_type}
    response = jsonify({'success': True, 'message': 'Task added successfully!', 'task_id': new_task.id})
    response.set_cookie('tasks', json.dumps(stored_tasks))
    return response


@app.route('/reload_data', methods=['GET'])
@login_required
def reload_data():
    user_id = current_user.id
    tasks = Task.query.filter_by(user_id=user_id).all()
    stored_tasks = {}
    for task in tasks:
        stored_tasks[str(task.id)] = {'task': task.task, 'type': task.type}
    response = jsonify({'success': True, 'tasks': stored_tasks})
    response.set_cookie('tasks', json.dumps(stored_tasks))
    return response


@app.route('/edit_task', methods=['POST'])
@login_required
def edit_task():
    task_id = request.form['task_id']
    new_text = request.form['new_text']

    # Fetch the task from the database
    task = Task.query.get(task_id)

    if task:
        # Update task text
        task.task = new_text
        db.session.commit()
        return jsonify({'success': True, 'message': 'Task updated successfully'})
    else:
        return jsonify({'success': False, 'message': 'Task not found'})


@app.route('/delete_task', methods=['POST'])
@login_required
def delete_task():
    task_id = request.form['task_id']
    try:
        # Delete the task from the database
        task = Task.query.filter_by(id=task_id, user_id=current_user.id).first()
        if task:
            db.session.delete(task)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Task deleted successfully!'})
        else:
            return jsonify({'success': False, 'message': 'Task not found or unauthorized'})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Failed to delete task: ' + str(e)})


@app.route('/drop_task_table', methods=['GET'])
def drop_task_table():
    try:
        with db.engine.connect() as conn:
            result = conn.execute(text('DROP TABLE IF EXISTS task'))
        return jsonify({'success': True, 'message': 'Task table dropped successfully!'})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Failed to drop Task table: ' + str(e)})


@app.route('/recreate_task_table', methods=['GET'])
def recreate_task_table():
    try:
        with db.engine.connect() as conn:
            query = """
            CREATE TABLE IF NOT EXISTS task (
                id SERIAL PRIMARY KEY,
                task TEXT NOT NULL,
                type VARCHAR(20) NOT NULL
            )
            """
            result = conn.execute(text(query))
        return jsonify({'success': True, 'message': 'Task table recreated successfully!'})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Failed to recreate Task table: ' + str(e)})


@app.route('/drop_user_table', methods=['GET'])
def drop_user_table():
    try:
        with db.engine.connect() as conn:
            result = conn.execute(text('DROP TABLE IF EXISTS user'))
        return jsonify({'success': True, 'message': 'User table dropped successfully!'})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Failed to drop User table: ' + str(e)})


@app.route('/recreate_user_table', methods=['GET'])
def recreate_user_table():
    try:
        with db.engine.connect() as conn:
            query = """
            CREATE TABLE IF NOT EXISTS user (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL
            )
            """
            result = conn.execute(text(query))
        return jsonify({'success': True, 'message': 'User table recreated successfully!'})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Failed to recreate User table: ' + str(e)})


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
