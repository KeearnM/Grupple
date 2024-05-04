from flask import jsonify, request
from .models.user import User
from .models.groupbuy import Groupbuy
from .models.listing import Listing
from .models.participant import Participant
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models.database import db
from .app import app, bcrypt, jwt
import re
from datetime import datetime

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
    
        # Validate email format
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"error": "Invalid email format"}), 400
    
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already in use"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(name=name, email=email, password=hashed_password, is_admin=is_admin)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "new user added"}), 201


@app.route('/login', methods=['POST']) #Used in login feature
def login():

    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')

    # Validate email format
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"error": "Invalid email format"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error":"Not authorised"}), 401
    
    access_token = create_access_token(identity=user.user_id)
    return jsonify(access_token=access_token, msg="logged in", user=user.user_id, admin=user.is_admin),200
    

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

#new routes

@app.route('/groupbuys', methods=['GET']) #Used in home page
def getAllGroupbuys():
    # Perform a join operation to fetch Groupbuy and related User data
    allBuys = db.session.query(Groupbuy, User.name).join(User, Groupbuy.user_id == User.user_id).filter(Groupbuy.end_date > datetime.utcnow()).all()

    if allBuys:
        groupbuys = []
        for groupbuy, user_name in allBuys:
            groupbuys.append({
                'groupbuy_id': groupbuy.groupbuy_id,
                'user_name': user_name, # Use user_name instead of user_id
                'title': groupbuy.title,
                'description': groupbuy.description,
                'start_date': groupbuy.start_date,
                'end_date': groupbuy.end_date
            })
        return jsonify(groupbuys)
    else:
        return jsonify({'msg':'No groupbuys found'})

    

@app.route('/groupbuys', methods=['PUT'])
@jwt_required()
def addGroupBuy():

    data = request.get_json()
    user_id = data.get('user_id')
    title = data.get('title')
    description = data.get('description')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    # Validate date range
    if start_date > end_date:
        return jsonify(error="Start date cannot be later than end date"), 400

    new_buy = Groupbuy(user_id=user_id, title=title, description=description,
                       start_date=start_date, end_date=end_date)
    db.session.add(new_buy)
    db.session.commit()
    return jsonify(msg="group buy added")

@app.route('/listings/<int:groupbuy_id>', methods=['GET'])
@jwt_required()
def getListing(groupbuy_id):
    listings = Listing.query.filter_by(groupbuy_id=groupbuy_id)
    product_names = [i.product_name for i in listings]
    return jsonify(product_names=product_names)

    
@app.route('/listings', methods=['PUT'])
@jwt_required()
def addListing():

    data = request.get_json()

    # Check for required fields
    if not all(key in data for key in ['groupbuy_id', 'product_name']):
        return jsonify({"error": "Missing required fields"}), 400
    
    groupbuy_id = data.get('groupbuy_id')
    product_name = data.get('product_name')

    new_listing = Listing(groupbuy_id=groupbuy_id, product_name=product_name)
    db.session.add(new_listing)
    db.session.commit()
    return jsonify('Listing added')

@app.route('/participants', methods=['PUT'])
@jwt_required()
def addParticipants():

    data = request.get_json()

    # Check for required fields
    if not all(key in data for key in ['amount', 'listing_id', 'user_id']):
        return jsonify({"error": "Missing required fields"}), 400

    # Validate data types
    try:
        amount = float(data.get('amount'))
        listing_id = int(data.get('listing_id'))
        user_id = int(data.get('user_id'))
        payment = bool(data.get('payment', False))
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid data types"}), 400

    # Check if listing_id and user_id exist
    existing_listing = Listing.query.get(listing_id)
    existing_user = User.query.get(user_id)
    if not existing_listing or not existing_user:
        return jsonify({"error": "Listing ID or User ID does not exist"}), 400

    new_participant = Participant(amount=amount, listing_id=listing_id, user_id=user_id, payment=payment)
    db.session.add(new_participant)
    db.session.commit()


    

@app.route('/groupbuy/participants/<int:groupbuy_id>', methods=['GET']) # Use URL parameter
@jwt_required()
def getGroupbuyParticipants(groupbuy_id): # Add groupbuy_id as a parameter
    # Query to join Participant, User, and Listing tables
    participants = db.session.query(
        Participant.participant_id,
        Participant.amount,
        Participant.payment,
        User.name.label('user_name'),
        Listing.product_name.label('listing_name')
    ).join(
        User, Participant.user_id == User.user_id
    ).join(
        Listing, Participant.listing_id == Listing.listing_id
    ).filter(
        Listing.groupbuy_id == groupbuy_id
    ).all()

    # Convert the query result to a list of dictionaries
    participants_list = [
        {
            'participant_id': participant.participant_id,
            'amount': participant.amount,
            'payment': participant.payment,
            'user_name': participant.user_name,
            'listing_name': participant.listing_name
        } for participant in participants
    ]

    return jsonify(participants_list)

from sqlalchemy import func

@app.route('/groupbuy/total/participants/<int:groupbuy_id>', methods=['GET']) # Use URL parameter
@jwt_required()
def getTotalGroupbuyParticipants(groupbuy_id): # Add groupbuy_id as a parameter
    # Query to join Participant, User, and Listing tables and calculate total amounts per product
    total_amounts = db.session.query(
        Listing.product_name,
        func.sum(Participant.amount).label('total_amount')
    ).join(
        Participant, Participant.listing_id == Listing.listing_id
    ).filter(
        Listing.groupbuy_id == groupbuy_id
    ).group_by(
        Listing.product_name
    ).all()

    # Convert the query result to a list of dictionaries
    total_amounts_list = [
        {
            'product_name': product_name,
            'total_amount': total_amount
        } for product_name, total_amount in total_amounts
    ]

    return jsonify(total_amounts_list)



@app.route('/groupbuys/host/id', methods=['POST'])
@jwt_required()
def get_groupbuys_by_host():
    # Extract user_id from the request body
    data = request.get_json()

    # Validate required fields
    if not data or 'user_id' not in data:
        return jsonify({"error": "Missing 'user_id' in request body"}), 400
    
    user_id = data.get('user_id')
    
    # Query the Groupbuy table for rows matching the provided user_id
    groupbuys = db.session.query(Groupbuy).filter_by(user_id=user_id).all()
    
    # Convert the query results into a list of dictionaries for easy JSON serialization
    groupbuys_data = []
    for groupbuy in groupbuys:
        groupbuy_data = {
            'groupbuy_id': groupbuy.groupbuy_id,
            'title': groupbuy.title,
            'description': groupbuy.description,
            'start_date': groupbuy.start_date.isoformat(),
            'end_date': groupbuy.end_date.isoformat(),
        }
        groupbuys_data.append(groupbuy_data)
    
    # Return the results as JSON
    return jsonify(groupbuys_data)


@app.route('/groupbuy/<int:user_id>', methods=['GET']) #Used in home page post login
@jwt_required()
def get_groupbuys_by_user(user_id):
    try:
        # Query to get group buys the user has participated in, including the host's name
        query = db.session.query(Groupbuy, User.name).\
            join(Listing, Groupbuy.groupbuy_id == Listing.groupbuy_id).\
            join(Participant, Listing.listing_id == Participant.listing_id).\
            join(User, Groupbuy.user_id == User.user_id).\
            filter(Participant.user_id == user_id)
        
        # Fetch all group buys
        groupbuys = query.all()
        
        # Convert group buys to a list of dictionaries for JSON serialization, including the host's name
        groupbuys_list = [{'groupbuy_id': gb.groupbuy_id, 'title': gb.title, 'description': gb.description, 'host_name': host_name} for gb, host_name in groupbuys]
        
        return jsonify(groupbuys_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/participations/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_participations_by_user(user_id):
    # Query the Participant model for entries that match the given user ID
    participations = db.session.query(Participant).\
        filter(Participant.user_id == user_id).\
        all()

    # Convert the query result to a list of dictionaries
    participations_list = [
        {
            'participant_id': participation.participant_id,
            'amount': participation.amount,
            'payment': participation.payment,
            'groupbuy_title': participation.listing.groupbuy.title,
            'product_name': participation.listing.product_name,
        } for participation in participations
    ]

    return jsonify(participations_list)


@app.route('/groupbuy/<int:groupbuy_id>/listings')
@jwt_required
def get_groupbuy_listings(groupbuy_id):
    groupbuy = Groupbuy.query.get(groupbuy_id)
    if groupbuy is None:
        return jsonify({"error": "Group buy not found"}), 404

    # Manually convert each listing to a dictionary
    listings = [{'listing_id': listing.listing_id, 'product_name': listing.product_name} for listing in groupbuy.listings]

    return jsonify(listings)

@app.route('/groupbuy/detail/<int:groupbuy_id>', methods=['GET'])
def get_groupbuy(groupbuy_id):
    # Fetch the Groupbuy
    groupbuy = db.session.query(Groupbuy).get(groupbuy_id)
    if groupbuy is None:
        return jsonify({"error": "Groupbuy not found"}), 404

    # Fetch the Listings associated with the Groupbuy
    listings = db.session.query(Listing).filter_by(groupbuy_id=groupbuy_id).all()

    # Prepare the response
    response = {
        "groupbuy_id": groupbuy.groupbuy_id,
        "title": groupbuy.title,
        "description": groupbuy.description,
        "start_date": groupbuy.start_date.isoformat(),
        "end_date": groupbuy.end_date.isoformat(),
        "listings": [
            {
                "listing_id": listing.listing_id,
                "product_name": listing.product_name,
                "participants_count": len(listing.participants)
            } for listing in listings
        ]
    }

    return jsonify(response)

#User Routes

@app.route('/allusers', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.with_entities(User.user_id, User.name, User.is_admin).all()
    
    users_list = [{'user_id': user.user_id, 'name': user.name, 'admin': user.is_admin,} for user in users]
    return jsonify(users_list)

@app.route('/toggle-admin/<int:target_user_id>', methods=['POST'])
@jwt_required()
def toggle_admin(target_user_id):
    data = request.get_json()
    requesting_user_id = data.get('user_id')

    if not requesting_user_id:
        return jsonify({"error": "Missing 'user_id' in request body"}), 400

    # Query the User table for the requesting user
    requesting_user = User.query.get(requesting_user_id)

    # Check if the requesting user is an admin
    if not requesting_user or not requesting_user.is_admin:
        return jsonify({"error": "Unauthorized to perform this action"}), 403

    # Query the User table for the user to be toggled
    target_user = User.query.get(target_user_id)

    if target_user is None:
        return jsonify({"error": "Target user not found"}), 404
    
    # Toggle the target user's admin status
    target_user.is_admin = not target_user.is_admin
    db.session.commit()
    return jsonify({"message": "Admin status toggled successfully for user", "user_id": target_user_id}), 200


@app.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    data = request.get_json()

    requesting_user_id = data.get('user_id')

    if not requesting_user_id:
        return jsonify({"error": "Missing 'user_id' in request body"}), 400

    # Query the User table for the requesting user
    requesting_user = User.query.get(requesting_user_id)

    # Check if the requesting user is an admin
    if not requesting_user or not requesting_user.is_admin:
        return jsonify({"error": "Unauthorized to perform this action"}), 403

    if user:
        groupbuys = Groupbuy.query.filter_by(user_id=user_id).all()
        for groupbuy in groupbuys:
            listings = Listing.query.filter_by(groupbuy_id=groupbuy.groupbuy_id).all()
            for listing in listings:
                Participant.query.filter_by(listing_id=listing.listing_id).delete()
            db.session.delete(groupbuy)
        
        Participant.query.filter_by(user_id=user_id).delete()
        
        db.session.commit()
        
        db.session.delete(user)
        db.session.commit()
        return {'message': 'User and related groupbuys, listings, and participants deleted successfully'}
    else:
        return {'error': 'User not found'}, 404