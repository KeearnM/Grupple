from sqlalchemy import Column, Integer, String, DATE, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base, db

class Groupbuy(db.Model):
    __tablename__ = 'groupbuy'
    groupbuy_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('app_user.user_id'))
    title = Column(String(50))
    description = Column(Text)
    start_date = Column(DATE)
    end_date = Column(DATE)
    listings = relationship('Listing', backref='groupbuy')
