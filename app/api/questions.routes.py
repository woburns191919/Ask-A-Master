from flask import Blueprint, jsonify, request,redirect, url_for, abort
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User, Question, db
from app.models.answer import Answer
from sqlalchemy import func, distinct, or_, desc
# from ..forms import


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
