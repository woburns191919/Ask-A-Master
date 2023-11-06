from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app.models.question import question_topic_association



class Topic(db.Model):
    __tablename__ = 'topics'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)

    questions = db.relationship('Question', secondary=question_topic_association, back_populates='topics')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }
