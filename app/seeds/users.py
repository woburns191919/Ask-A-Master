from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text



def seed_users():
    chess_players = []

    grandmaster_data = [
            {"name": "Will Burns", "country": "United States", "email": "will@email.com", "hashed_password": "password", "elo_rating": 1600},
            {"name": "Magnus Carlsen", "country": "Norway", "email": "magnus@email.com", "hashed_password": "password1", "elo_rating": 2847},
            {"name": "Garry Kasparov", "country": "Russia", "email": "garry@email.com", "hashed_password": "password2", "elo_rating": 2851},
            {"name": "Viswanathan Anand", "country": "India", "email": "viswanathan@email.com", "hashed_password": "password3", "elo_rating": 2755},
            {"name": "Bobby Fischer", "country": "United States", "email": "bobby@email.com", "hashed_password": "password4", "elo_rating": 2785},
            {"name": "Vladimir Kramnik", "country": "Russia", "email": "vladimir@email.com", "hashed_password": "password5", "elo_rating": 2777},
            {"name": "Anatoly Karpov", "country": "Russia", "email": "anatoly@email.com", "hashed_password": "password6", "elo_rating": 2720},
            {"name": "Mikhail Tal", "country": "Latvia", "email": "mikhail@email.com", "hashed_password": "password7", "elo_rating": 2700},
            {"name": "Fabiano Caruana", "country": "United States", "email": "fabiano@email.com", "hashed_password": "password8", "elo_rating": 2820},
            {"name": "Hikaru Nakamura", "country": "United States", "email": "hikaru@email.com", "hashed_password": "password9", "elo_rating": 2745},
            {"name": "Levon Aronian", "country": "Armenia", "email": "levon@email.com", "hashed_password": "password10", "elo_rating": 2781},
        ]

    for data in grandmaster_data:
        username = data["name"].lower().replace(" ", "_")
        existing_user = User.query.filter_by(username=username).first()

        if existing_user:

            existing_user.email = data["email"]
            existing_user.hashed_password = data["hashed_password"]
            existing_user.first_name = data["name"].split()[0]
            existing_user.last_name = data["name"].split()[-1]
            existing_user.elo_rating = data["elo_rating"]
            existing_user.country = data["country"]
            chess_players.append(existing_user)
        else:

            user = User(
                username=username,
                email=data["email"],
                hashed_password=data["hashed_password"],
                first_name=data["name"].split()[0],
                last_name=data["name"].split()[-1],
                elo_rating=data["elo_rating"],
                country=data["country"]
            )
            chess_players.append(user)

    db.session.add_all(chess_players)
    db.session.commit()

    user_ids = [user.id for user in chess_players]
    return user_ids


def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
