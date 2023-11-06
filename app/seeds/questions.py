from app.models import db, User, Question, environment, SCHEMA
from app.models.topic import Topic
from sqlalchemy.sql import text



from app.models import db, Question

def seed_questions():
    questions = [
        { #1
            "title": "Chess books for advanced players",
            "body": "I've been playing chess for a while and want to advance my skills. Any recommendations for advanced chess books?",
            "user_id": 4,
            "topic_id": 2
        },
        { #2
            "title": "How to deal with the Sicilian Defense",
            "body": "I often face the Sicilian Defense and struggle to respond effectively. Any tips on handling it?",
            "user_id": 5,
            "topic_id": 1
        },
        { #3
            "title": "Basic question from an advanced and revered player",
            "body": "I'd like to improve my endgame skills. What are some common endgames to study and master?",
            "user_id": 6,
            "topic_id": 3
        },
        { #4
            "title": "Playing chess online: tips and platforms",
            "body": "I want to play chess online and improve my game. Any tips for online play and recommendations for platforms?",
            "user_id": 7,
            "topic_id": 7
        },
        { #5
            "title": "Analyzing my games: best practices",
            "body": "I record my chess games and want to analyze them to improve. What are the best practices for game analysis?",
            "user_id": 8,
            "topic_id": 5
        },
        { #6
            "title": "What are common chess blunders to avoid",
            "body": "My opponents often make critical blunders during my games. What are common chess blunders to watch out for?",
            "user_id": 9,
            "topic_id": 6
        },
        { #7
            "title": "Good vs bad bishops",
            "body": "Aren't all bishops good? I'd like to understand pawn structures better. How can you use pawn structure to make bad bishops and good bishops?",
            "user_id": 10,
            "topic_id": 5
        }
    ]

    for question_data in questions:
        question = Question(**question_data)
        db.session.add(question)

    try:
        db.session.commit()
        print("Questions successfully added.")
    except Exception as e:
        print(f"Error adding questions: {e}")
        db.session.rollback()



def undo_questions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM questions"))

    db.session.commit()
