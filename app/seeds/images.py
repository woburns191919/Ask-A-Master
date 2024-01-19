from app.models import db, User, Question, Image, environment, SCHEMA
from app.models.topic import Topic
from sqlalchemy.sql import text



def seed_images():
    image_data = [
      {"filename": "chess-analysis.webp", "question_id": 1},
      {"filename": "blunders.jpeg", "question_id": 2},
      {"filename": "bobby22.jpeg", "question_id": 3},
      {"filename": "structure.jpg", "question_id": 4},
      {"filename": "question_id_5.jpg", "question_id": 5},
      {"filename": "dark_squares.jpg", "question_id": 6},
      {"filename": "tactics.jpg", "question_id": 7},
      {"filename": "magnus22.jpeg", "question_id": 8},


]
    for img_data in image_data:
        new_image = Image(**img_data)
        db.session.add(new_image)

    try:
        db.session.commit()
        print("Images successfully added.")
    except Exception as e:
        print(f"Error adding images: {e}")
        db.session.rollback()

def undo_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM images")
    db.session.commit()
