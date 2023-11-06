from app.models.db import db, environment, SCHEMA
from app.models.question import Question
from app.models.answer import Answer
from app.models.topic import Topic
from sqlalchemy.sql import text

from app.models import db, environment, SCHEMA

def seed_topics():
    topics = [
        {
            "name": "Opening Theory",
            # 1
        },
        {
            "name": "Middle Game Strategy",
            # 2

        },
        {
            "name": "Endgame Techniques",
            # 3
        },
        {
            "name": "Tactics and Combinations",
            # 4
        },
        {
            "name": "Chess Analysis",
            # 5
        },
        {
            "name": "Avoiding Blunders",
            # 6
        },
        {
            "name": "Chess Books and Resources",
            # 7
        },

    ]

    for topic_data in topics:
        topic = Topic(**topic_data)
        db.session.add(topic)

    db.session.commit()

def undo_topics():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.topics RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM topics")

    db.session.commit()
