from app.models.db import db, environment, SCHEMA
from app.models.answer import Answer
from sqlalchemy.sql import text
from datetime import datetime


def seed_answers():
    answers = [
        {
            "user_id": 1,
            "question_id": 1,
            "content": "I would check out opening books and study the Queen's Gambit very closely. It's a classic opening that aims to control the center and allow for quicker piece development. It can lead to complex middlegame positions.",
        },
        {
            "user_id": 2,
            "question_id": 5,
            "content": "Middle-game strategy is critical, as lots of players blunder when the plot thickens and pieces come off the back rank. Focus on controlling the center, piece coordination, and king safety; while this won't guarantee a blunder-free match, it will keep you sharp!",
        },
        {
            "user_id": 3,
            "question_id": 2,
            "content": "The Sicilian Defense is rich in theory and offers black counterattacking chances. It can lead to sharp, tactical battles. To respond to it, you should look at some Boris vs Bobby matches--preferably the ones in Iceland.",
        },
        {
            "user_id": 4,
            "question_id": 1,
            "content": "For advanced players, consider 'My Great Predecessors' by Garry Kasparov and 'Pawn Structure Chess' by Andrew Soltis.",
        },
        {
            "user_id": 5,
            "question_id": 2,
            "content": "To handle the Sicilian Defense, castle queenside and create an imbalance. White will be attacking your kingside, and you need to keep calm and find the weak squares.",
        },
        {
            "user_id": 6,
            "question_id": 3,
            "content": "Study endgames like King and Pawn vs. King, Rook Endgames, and Queen vs. Pawn endgames.",
        },
        {
            "user_id": 7,
            "question_id": 4,
            "content": "Online chess platforms like lichess.org and chess.com are popular choices. Focus on improving your openings and tactics online.",
        },
        {
            "user_id": 8,
            "question_id": 5,
            "content": "Analyze your games with chess engines and review your mistakes. Study grandmaster games for insights.",
        },
        {
            "user_id": 9,
            "question_id": 6,
            "content": "Common blunders include not developing pieces, hanging pieces, and not paying attention to threats. My advice: take threats seriously!",
        },
        {
            "user_id": 10,
            "question_id": 7,
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
