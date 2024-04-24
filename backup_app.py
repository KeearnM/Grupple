import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, DATE, VARCHAR, Text, BOOLEAN, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from flask_bcrypt import Bcrypt

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

Base = declarative_base()

class User(Base):
    __tablename__ = 'app_user'
    user_id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(50))
    email = Column(VARCHAR(50))
    password = Column(VARCHAR(50))

class Groupbuy(Base):
    __tablename__ = 'groupbuy'
    groupbuy_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('app_user.user_id'))
    title = Column(VARCHAR(50))
    description = Column(Text)
    start_date = Column(DATE)
    end_date = Column(DATE)

class Listing(Base):
    __tablename__ = 'listing'
    listing_id = Column(Integer, primary_key=True)
    groupbuy_id = Column(Integer, ForeignKey('groupbuy.groupbuy_id'))
    product_name = Column(VARCHAR(50))

class Participant(Base):
    __tablename__ = 'participant'
    participant_id = Column(Integer, primary_key=True)
    amount = Column(Integer)
    listing_id = Column(Integer, ForeignKey('listing.listing_id'))
    user_id = Column(Integer, ForeignKey('app_user.user_id'))
    payment = Column(BOOLEAN)

@app.route('/')
def check():
    return 'Flask is working'

@app.route('/seed')
def seed():
    try:
        db.create_all()
        return 'Database tables created successfully'
    except Exception as e:
        return f'Error creating tables: {str(e)}', 500

