from flask import jsonify, request
from .models.user import User
from .models.groupbuy import Groupbuy
from .models.listing import Listing
from .models.participant import Participant
from flask_jwt_extended import create_access_token
from .models.database import db
from .app import app, bcrypt, jwt

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


@app.route('/login', methods=['POST'])
def login():

    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error":"Not authorised"}), 401
    
    access_token = create_access_token(identity=user.user_id)
    return jsonify(access_token=access_token, msg="logged in"),200
    

# @app.route('/protected', methods=['GET'])
# @jwt_required()
# def protected():
#     current_user = get_jwt_identity()
#     return jsonify(logged_in_as=current_user), 200
