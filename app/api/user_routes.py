from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User
from app.models.answer import Answer

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
# @login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/<int:user_id>/saved_questions')
@login_required
def get_saved_questions(user_id):
    if current_user.id != user_id:
        return jsonify({"message": "Unauthorized"}), 403

    saved_questions = current_user.saved_questions
    return jsonify([question.to_dict() for question in saved_questions])


@user_routes.route("/<int:id>/answers")
def get_answers_by_user(user_id):
    """
    Get all answers for specific user
    """
    answers = Answer.query.filter_by(user_id=user_id).all()
    return jsonify({'answers': [answer.to_dict() for answer in answers]})


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()
