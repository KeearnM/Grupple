import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from models.database import db, Base

load_dotenv()

CREATE_USERS_TABLE = ("""
CREATE TABLE IF NOT EXISTS app_user (
    user_id SERIAL PRIMARY KEY, 
    name VARCHAR(50), 
    email VARCHAR(50), 
    password VARCHAR(50)
)
""")

CREATE_GROUPBUY_TABLE = ("""
CREATE TABLE IF NOT EXISTS groupbuy (
    groupbuy_id SERIAL PRIMARY KEY, 
    user_id INT, 
    title VARCHAR(50), 
    description TEXT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (user_id) REFERENCES app_user(user_id)
)
""")


CREATE_LISTING_TABLE = ("""
CREATE TABLE IF NOT EXISTS listing (
    listing_id SERIAL PRIMARY KEY, 
    groupbuy_id INT, 
    product_name VARCHAR(50),
    FOREIGN KEY (groupbuy_id) REFERENCES groupbuy(groupbuy_id)
)
""")


CREATE_PARTICIPANTS_TABLE = ("""
CREATE TABLE IF NOT EXISTS participants (
    participants_id SERIAL PRIMARY KEY, 
    amount INT, 
    listing_id INT, 
    user_id INT,
    payment BOOLEAN,
    FOREIGN KEY (listing_id) REFERENCES listing(listing_id),
    FOREIGN KEY (user_id) REFERENCES app_user(user_id)
)
""")



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

@app.get('/')
def check():
    return 'Flask is working'

@app.post('/api/seed')
def create_user_table():
    try:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(CREATE_GROUPBUY_TABLE)
            cursor.execute(CREATE_LISTING_TABLE)
            cursor.execute(CREATE_PARTICIPANTS_TABLE)
            connection.commit() # Commit the transaction
            return jsonify({"message": "Table created successfully"}), 201
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

