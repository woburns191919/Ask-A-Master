from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime
from ..models.user import saved_questions_association

def add_prefix_for_prod(attr):
    if environment == "production":
        return f"{SCHEMA}.{attr}"
    else:
        return attr

class Image(db.Model):
    __tablename__ = 'images'

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String, nullable=False) 
    question_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('questions.id')))

    question = db.relationship('Question', back_populates='image')

    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'question_id': self.question_id
        }
