from app.models.db import db, environment, SCHEMA
from app.models.answer import Answer
from sqlalchemy.sql import text
from datetime import datetime


def seed_answers():
    answers = [
        {
            "user_id": 1,
            "question_id": 1,
            "content": "The Queen's Gambit is a classic opening that aims to control the center and allow for quicker piece development. It can lead to complex middlegame positions.",
        },
        {
            "user_id": 2,
            "question_id": 2,
            "content": "Middle-game strategy is critical. Focus on controlling the center, piece coordination, and king safety.",
        },
        {
            "user_id": 3,
            "question_id": 3,
            "content": "The Sicilian Defense is rich in theory and offers black counterattacking chances. It can lead to sharp, tactical battles.",
        },
        {
            "user_id": 4,
            "question_id": 4,
            "content": "For advanced players, consider 'My Great Predecessors' by Garry Kasparov and 'Pawn Structure Chess' by Andrew Soltis.",
        },
        {
            "user_id": 5,
            "question_id": 5,
            "content": "To handle the Scandinavian Defense, develop your pieces, control the center, and focus on your pawn structure.",
        },
        {
            "user_id": 6,
            "question_id": 6,
            "content": "Study endgames like King and Pawn vs. King, Rook Endgames, and Queen vs. Pawn endgames.",
        },
        {
            "user_id": 7,
            "question_id": 7,
            "content": "Online chess platforms like lichess.org and chess.com are popular choices. Focus on improving your openings and tactics online.",
        },
        {
            "user_id": 8,
            "question_id": 8,
            "content": "Analyze your games with chess engines and review your mistakes. Study grandmaster games for insights.",
        },
        {
            "user_id": 9,
            "question_id": 9,
            "content": "Common blunders include not developing pieces, hanging pieces, and not paying attention to threats.",
        },
        {
            "user_id": 10,
            "question_id": 10,
            "content": "Understanding pawn structures is crucial. Isolani pawns can make 'bad' bishops, and pawn chains can create 'good' bishops.",
        },
    ]

    for answer_data in answers:
        answer = Answer(**answer_data)
        db.session.add(answer)

    db.session.commit()

def undo_answers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.answers RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM answers"))

    db.session.commit()
