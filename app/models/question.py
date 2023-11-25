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

question_topic_association = db.Table(
    'question_topic_association',
    db.Column('question_id', db.Integer, db.ForeignKey(add_prefix_for_prod('questions.id')), primary_key=True),
    db.Column('topic_id', db.Integer, db.ForeignKey(add_prefix_for_prod('topics.id')), primary_key=True)
)



if environment == "production":
    question_topic_association.schema=SCHEMA


class Question(db.Model):
    __tablename__ = 'questions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    body = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    topic_id=db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('topics.id')))
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())

    user = db.relationship('User', back_populates='questions')
    topics = db.relationship('Topic', secondary=question_topic_association, back_populates='questions')
    answers = db.relationship('Answer', back_populates='question', cascade='all, delete-orphan')
    saved_by = db.relationship('User', secondary=saved_questions_association, back_populates='saved_questions')
    image = db.relationship('Image', back_populates='question', uselist=False, cascade='all, delete-orphan')


    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'body': self.body,
            'user_id': self.user_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
