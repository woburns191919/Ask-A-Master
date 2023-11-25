from flask import Blueprint, jsonify, request,redirect, url_for, abort
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User, db
from app.models.answer import Answer
from app.models.topic import Topic
from app.models.question import Question
from app.models.image import Image
from sqlalchemy import func, distinct, or_, desc

topics_routes = Blueprint('topics', __name__)



@topics_routes.route("/new", methods=["POST"])
#  @login_required
def create_topic():
    """
    Create a new topic.
    """
    data = request.json

    # Check if the 'name' key is in the request data
    if 'name' not in data:
        return jsonify({'error': 'Name is required'}), 400

    # Check if a topic with this name already exists
    existing_topic = Topic.query.filter_by(name=data['name']).first()
    if existing_topic:
        return jsonify({'error': 'A topic with this name already exists'}), 400

    new_topic = Topic(name=data['name'])
    db.session.add(new_topic)
    db.session.commit()

    return jsonify(new_topic.to_dict()), 201

@topics_routes.route("/")
def get_all_topics():
  """returns a dictionary of all topics"""
  topics = db.session.query(Topic).all()
  all_topics = {'topics': [topic.to_dict() for topic in topics]}
  return jsonify(all_topics)




@topics_routes.route('/<int:topic_id>/questions')
def get_questions_by_topic(topic_id):
    """
    Returns questions for a specific topic, including image filenames.
    """
    questions = Question.query.filter_by(topic_id=topic_id).all()

    if not questions:
        return jsonify({'error': 'No questions found for this topic'}), 404

    questions_data = []
    for question in questions:
        question_data = question.to_dict()

        # Fetch associated image for each question
        image = Image.query.filter_by(question_id=question.id).first()
        if image:
            question_data["image_filename"] = image.filename

        questions_data.append(question_data)

    return jsonify({'questions': questions_data})

@topics_routes.route('/<int:topic_id>')
def get_info_topic(topic_id):
    """
    returns topic info
    """
    topic = Topic.query.get(topic_id)

    if not topic:
        return jsonify({'error': 'No info found for this topic'}), 404

    return jsonify({'topic': topic.to_dict()})
