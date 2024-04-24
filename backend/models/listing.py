from sqlalchemy import Column, Integer, String, VARCHAR, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Listing(Base):
    __tablename__ = 'listing'
    listing_id = Column(Integer, primary_key=True)
    groupbuy_id = Column(Integer, ForeignKey('groupbuy.groupbuy_id'))
    product_name = Column(String(50))
    participants = relationship('Participant', backref='listing')
