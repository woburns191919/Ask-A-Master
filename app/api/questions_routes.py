from flask import Blueprint, jsonify, request, redirect, url_for, abort
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User, Question, db
from app.models.answer import Answer
from app.forms import question_form

questions_routes = Blueprint('questions', __name__)

@questions_routes.route("<int:question_id>/answers")
def get_answers_for_question(question_id):
    """returns answers to a specific question"""
    answers = Answer.query.filter_by(question_id=question_id).all()
    return jsonify({'answers': [answer.to_dict() for answer in answers]})

@questions_routes.route("/")
def get_all_questions():
  """returns a dictionary of all questions"""
  questions = db.session.query(Question).all()
  all_questions = {'questions': [question.to_dict() for question in questions]}
  return jsonify(all_questions)



@questions_routes.route('/new', methods=['POST'])
def create_question():

    data = request.get_json()

    title = data.get('title')
    body = data.get('body')
    user_id = data.get('user_id')
    topic_id = data.get('topic_id')


    # if not title or not body or user_id is None or topic_id is None:
    #     return jsonify({'error': 'Missing required fields'}), 400


    new_question = Question(
        title=title,
        body=body,
        user_id=user_id,
        topic_id=topic_id
    )

    db.session.add(new_question)
    db.session.commit()

    return jsonify({'message': 'Question created successfully', 'question': new_question.to_dict()}), 201
