
from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.models import db
from flask_login import UserMixin

saved_questions_association = db.Table(
    'saved_questions',
    db.Model.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True),
    db.Column('question_id', db.Integer, db.ForeignKey(add_prefix_for_prod('questions.id')), primary_key=True)
)

if environment == "production":
    saved_questions_association.schema = SCHEMA

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    elo_rating = db.Column(db.Integer, nullable=True)
    country = db.Column(db.String(100), nullable=True)
    first_name = db.Column(db.String(40), nullable=True)
    last_name = db.Column(db.String(40), nullable=True)

    questions = db.relationship("Question", back_populates="user")
    saved_questions = db.relationship('Question', secondary=saved_questions_association, back_populates='saved_by')
    answers = db.relationship("Answer", back_populates="user")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return self.hashed_password == password


    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'elo_rating': self.elo_rating,
            'country': self.country,
            'first_name': self.first_name,
            'last_name': self.last_name
        }
