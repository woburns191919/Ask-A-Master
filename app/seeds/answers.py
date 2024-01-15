from app.models.db import db, environment, SCHEMA
from app.models.answer import Answer
from sqlalchemy.sql import text
from datetime import datetime


def seed_answers():
    answers = [
         {

            "user_id": 2,
            "question_id": 1,
            "content": "I would check out opening books and study the Queen's Gambit very closely. It's a classic opening that aims to control the center and allow for quicker piece development. It can lead to complex middlegame positions.",
        },
        {
            "user_id": 1,
            "question_id": 5,
            "content": "Middle-game strategy is critical, as lots of players blunder when the plot thickens and pieces come off the back rank. Focus on controlling the center, piece coordination, and king safety; while this won't guarantee a blunder-free match, it will keep you sharp!",
        },
        {
            "user_id": 4,
            "question_id": 2,
            "content": "The Sicilian Defense is rich in theory and offers black counterattacking chances. It can lead to sharp, tactical battles. To respond to it, you should look at some Boris vs Bobby matches--preferably the ones in Iceland.",
        },

        {
            "user_id": 3,
            "question_id": 3,
            "content": "Study endgames like King and Pawn vs. King, Rook Endgames, and Queen vs. Pawn endgames.",
        },
        {
            "user_id": 5,
            "question_id": 4,
            "content": "Online chess platforms like lichess.org and chess.com are popular choices. Focus on improving your openings and tactics online.",
        },
        {
            "user_id": 7,
            "question_id": 8,
            "content": "Even the best players can find new challenges and ways to improve. There's always something new to learn in chess!",
        },
        {
            "user_id": 8,
            "question_id": 2,
            "content": "Try to understand the key principles behind the Sicilian Defense. It's all about pawn structure and piece activity.",
        },
        {
            "user_id": 9,
            "question_id": 3,
            "content": "Endgames are crucial. Focus on pawn endgames and rook endgames, as they are the most common and can often determine the outcome of the game.",
        },
        {
            "user_id": 10,
            "question_id": 4,
            "content": "Online chess platforms offer a variety of tools to help improve your game, including puzzle challenges and game analysis features.",
        },
        {
            "user_id": 1,
            "question_id": 5,
            "content": "Game analysis is all about understanding your mistakes and learning from them. Pay special attention to your opening strategy and endgame technique.",
        },
        {
            "user_id": 2,
            "question_id": 6,
            "content": "Common blunders include not controlling the center, neglecting king safety, and poor coordination of pieces. Always be vigilant!",
        },
        {
            "user_id": 3, 
            "question_id": 7,
            "content": "Pawn structures can greatly influence the effectiveness of your bishops. Pay attention to how pawns are arranged and plan accordingly.",
        }
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
