from sqlalchemy import Column, Integer, ForeignKey, BOOLEAN
from .database import Base,db

class Participant(db.Model):
    __tablename__ = 'participant'
    participant_id = Column(Integer, primary_key=True)
    amount = Column(Integer)
    listing_id = Column(Integer, ForeignKey('listing.listing_id'))
    user_id = Column(Integer, ForeignKey('app_user.user_id'))
    payment = Column(BOOLEAN)
