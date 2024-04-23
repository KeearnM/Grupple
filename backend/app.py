import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

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
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)

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
        return jsonify({"error": str(e)}), 500