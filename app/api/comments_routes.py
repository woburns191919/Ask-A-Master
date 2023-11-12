from flask import Blueprint, jsonify, request, redirect, url_for, abort
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User, Question, db
from app.models.answer import Answer
from app.forms import question_form

comments_routes = Blueprint('comments', __name__)

@comments_routes.route("/<int:comment_id>/edit", methods=['GET','PUT'])
@login_required
def edit_comment(question_id, comment_id):
  
    """
    Edit an existing comment
    """

    if not current_user.is_authenticated:
        return jsonify({"message": "You need to be logged in"}), 401

    comment_to_edit = Answer.query.get(comment_id)

    if not comment_to_edit:
        return jsonify({"message": "Comment not found"}), 404

    if comment_to_edit.user_id != current_user.id:
        return jsonify({"message": "You cannot edit this comment"}), 403

    data = request.get_json()
    new_content = data.get('content')

    if not new_content:
        return jsonify({"error": "Comment content cannot be empty"}), 400

    comment_to_edit.content = new_content

    db.session.commit()

    return jsonify({"message": "Comment edited successfully", "comment": comment_to_edit.to_dict()}), 200


@comments_routes.route("/new", methods=['POST'])
@login_required
def add_comment_to_question(question_id):
    """Add a new comment (answer) to a specific question"""
    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({'error': 'Comment content cannot be empty'}), 400

    new_comment = Answer(
      content=content,
      user_id=current_user.id,
      question_id=question_id
      )
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({'message': 'Comment added successfully', 'comment': new_comment.to_dict()}), 201

@comments_routes.route("/", methods=['GET'])
def get_comments_for_question(question_id):
    """Get comments for a specific question"""
    answers = Answer.query.filter_by(question_id=question_id).all()
    return jsonify({'comments': [answer.to_dict() for answer in answers]})
