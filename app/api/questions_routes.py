from flask import Blueprint, jsonify, request, redirect, url_for, abort
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User, Question, db
from app.models.answer import Answer
from app.forms import question_form

questions_routes = Blueprint('questions', __name__)

@questions_routes.route("/<int:question_id>", methods=['DELETE'])
@login_required
def delete_question(question_id):
    print(f"Current User: {current_user}, User ID: {current_user.id}")
    print(f"Requested Question ID for Deletion: {question_id}")
    try:
        # Check if the user is authenticated
        if not current_user.is_authenticated:
            return jsonify(message="You need to be logged in"), 401

        # Retrieve the question to be deleted
        question_to_delete = Question.query.get(question_id)

        # Check if the question exists
        if not question_to_delete:
            return jsonify(message="Question not found"), 404


        if str(question_to_delete.user_id) != str(current_user.id):
            print("User is not the owner of the question")
            print('question to del id, cur user id', question_to_delete.user_id, current_user.id)
            return jsonify(message="You cannot delete this question"), 403

        # Delete the question from the database
        db.session.delete(question_to_delete)
        db.session.commit()

        return jsonify(message="Question deleted successfully"), 200

    except Exception as e:
        # Log the exception
        print("Error deleting question:", str(e))
        return jsonify(message="Internal Server Error"), 500


@questions_routes.route("<int:question_id>/answers")
def get_answers_for_question(question_id):
    """returns answers to a specific question"""
    answers = Answer.query.filter_by(question_id=question_id).all()
    return jsonify({'answers': [answer.to_dict() for answer in answers]})

@questions_routes.route("<int:question_id>")
def get_question(question_id):
    """returns a specific question by id"""
    question = Question.query.get(question_id)
    return jsonify(question.to_dict())



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

@questions_routes.route("/")
def get_all_questions():
  """returns a dictionary of all questions"""
  questions = db.session.query(Question).all()
  all_questions = {'questions': [question.to_dict() for question in questions]}
  return jsonify(all_questions)





@questions_routes.route('/edit/<int:question_id>', methods=['GET', 'PUT'])
@login_required
def edit_question(question_id):
    # Check if the user is authenticated
    if not current_user.is_authenticated:
        return jsonify(message="You need to be logged in"), 401

    # Retrieve the question to be edited
    question_to_edit = Question.query.get(question_id)

    # Check if the question exists
    if not question_to_edit:
        return jsonify(message="Question not found"), 404

    # Check if the logged-in user is the owner of the question
    if question_to_edit.user_id != current_user.id:
        return jsonify(message="You cannot edit this question"), 403

    if request.method == 'GET':
        # Return the current question details
        return jsonify(question=question_to_edit.to_dict()), 200

    elif request.method == 'PUT':
        # Parse the JSON data from the request
        data = request.get_json()

        # Update the question fields with the new data
        question_to_edit.title = data.get('title', question_to_edit.title)
        question_to_edit.body = data.get('body', question_to_edit.body)
        question_to_edit.topic_id = data.get('topic_id', question_to_edit.topic_id)

        # Commit the changes to the database
        db.session.commit()

        return jsonify(message="Question edited successfully", question=question_to_edit.to_dict()), 200
