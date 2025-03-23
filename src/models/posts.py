from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, UniqueConstraint, Text
from sqlalchemy.orm import relationship

from src.database import Base

class Categories(Base):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)


class Posts(Base):
    __tablename__ = 'posts'
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    author = Column(Integer, ForeignKey('users.id'), nullable=False)
    category = Column(Integer, ForeignKey('categories.id'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    likes = Column(Integer, nullable=False, default=0)

    author_rel = relationship('User', backref='posts')
    category_rel = relationship('Categories', backref='posts')
    likes_rel = relationship('PostLikes', cascade='all, delete')  # УБРАЛ backref


class PostLikes(Base):
    __tablename__ = 'post_likes'

    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey('posts.id', ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    post_rel = relationship('Posts')  # УБРАЛ backref, т.к. связь уже есть в `Posts`
    user_rel = relationship('User', backref='likes_rel', cascade="all, delete")

    __table_args__ = (UniqueConstraint('post_id', 'user_id', name='unique_post_user_like'),)
