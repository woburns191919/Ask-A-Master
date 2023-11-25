from app.models import db, User, Question, Image, environment, SCHEMA
from app.models.topic import Topic
from sqlalchemy.sql import text



def seed_images():
    image_data = [
      {"filename": "analysis.png", "question_id": 1},
      {"filename": "blunder.png", "question_id": 2},
      {"filename": "fischer.png", "question_id": 3},
      {"filename": "structure.jpg", "question_id": 4},
      {"filename": "images.png", "question_id": 5},
      {"filename": "pawn.jpg", "question_id": 6},
      {"filename": "bad-bishop.jpg", "question_id": 7},
      {"filename": "magnus.jpg", "question_id": 8},


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
