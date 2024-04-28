import os
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from .models.database import db
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# Configure Flask app
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv("SECRET_KEY")

db.init_app(app)

# Initialize extensions
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Import routes
from backend.routes import *
