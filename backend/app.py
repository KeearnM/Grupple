import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from models.database import db, Base

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
bcrypt = Bcrypt(app)

# Import models to ensure they are registered with SQLAlchemy
from models.user import User
from models.groupbuy import Groupbuy
from models.listing import Listing
from models.participant import Participant

@app.route('/')
def check():
    return 'Flask is working'

@app.route('/seed')
def seed():
    try:
        Base.metadata.create_all(bind=db.engine)
        return 'Database tables created successfully'
    except Exception as e:
        return f'Error creating tables: {str(e)}', 500

@app.route('/user', methods=['PUT'])
def add_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data"}), 400
    
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    is_admin = data.get('is_admin', False) # Default to False if not provided

    if not name or not email or not password:
        return jsonify({"error": "Missing name, email, or password"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(name=name, email=email, password=hashed_password, is_admin=is_admin)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "new user added"}), 201

