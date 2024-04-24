from sqlalchemy import Column, Integer, String, VARCHAR, BOOLEAN
from database import Base

class User(Base):
    __tablename__ = 'app_user'
    user_id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(50))
    email = Column(VARCHAR(50))
    password = Column(VARCHAR(100))
    is_admin = Column(BOOLEAN, default=False)
