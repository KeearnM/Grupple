from flask import jsonify, request
from .models.user import User
from .models.groupbuy import Groupbuy
from .models.listing import Listing
from .models.participant import Participant
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models.database import db
from .app import app, bcrypt, jwt

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
    

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

#new routes

@app.route('/groupbuys', methods=['GET'])
@jwt_required()
def getAllGroupbuys():
    # Perform a join operation to fetch Groupbuy and related User data
    allBuys = db.session.query(Groupbuy, User.name).join(User, Groupbuy.user_id == User.user_id).all()

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

    new_buy = Groupbuy(user_id=user_id, title=title, description=description,
                       start_date=start_date, end_date=end_date)
    db.session.add(new_buy)
    db.session.commit()
    return jsonify(msg="group buy added")

@app.route('/listings', methods=['GET'])
@jwt_required()
def getListing():
    
    data = request.get_json()

    groupbuy_id = data.get('groupbuy_id')

    listings = Listing.query.filter_by(groupbuy_id=groupbuy_id)

    for i in listings:
        return jsonify(product_name=i.product_name)
    
@app.route('/listings', methods=['PUT'])
@jwt_required()
def addListing():

    data = request.get_json()
    
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

    amount = data.get('amount')
    listing_id = data.get('listing_id')
    user_id = data.get('user_id')
    payment = data.get('payment', False)

    new_participant = Participant(amount=amount, listing_id=listing_id, user_id=user_id, payment=payment)
    db.session.add(new_participant)
    db.session.commit()

# @app.route('/groupbuy/participants', methods=['GET'])
# @jwt_required()
# def getGroupbuyParticipants():

#     data = request.get_json()

#     groupbuy_id = data.get('groupbuy_id')

#     groupbuy = Groupbuy.query.filter(Groupbuy.groupbuy_id == groupbuy_id).first()

#     if groupbuy:
#         participants = []
#         for listing in groupbuy.listings:
#             for participant in listing.participants:
#                 participants.append({
#                     'participant_id': participant.participant_id,
#                     'amount': participant.amount,
#                     'payment': participant.payment
#                 })
#         return jsonify(participants)
#     else:
#         return jsonify({'error': 'groupbuy not found'})
    

@app.route('/groupbuy/participants', methods=['GET'])
@jwt_required()
def getGroupbuyParticipants():
    data = request.get_json()

    if not data or 'groupbuy_id' not in data:
        return jsonify({'error': 'groupbuy_id is required'}), 400

    groupbuy_id = data.get('groupbuy_id')

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