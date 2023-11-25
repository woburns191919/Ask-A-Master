from flask import Blueprint, jsonify, request, redirect, url_for, abort
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User, Question, db
from app.models.answer import Answer
from app.forms import question_form
from app.models.image import Image
import spacy


questions_routes = Blueprint('questions', __name__)

nlp = spacy.load("en_core_web_sm")

def extract_keywords(text):
    """ Extract keywords from the text """
    doc = nlp(text)
    return [token.lemma_ for token in doc if token.pos_ in ["NOUN", "PROPN"]]

def map_keywords_to_image(keywords):
    keyword_to_image = {
        "blunder": ["blunder.png"],
        "analysis": ["analysis.png"],
        "structure": ["structure.jpg"],
        "analyze": ["images.png"],
        "bishop": ["bad-bishop.jpg"],
        "pawn": ["pawn.jpg"],
        "magnus": ["magnus.jpg"]
    }


    image_scores = {image: 0 for images in keyword_to_image.values() for image in images}

    # Score each image based on how many keywords it matches
    for keyword in keywords:
        for image in keyword_to_image.get(keyword, []):
            image_scores[image] += 1

    # Find the image with the highest score
    best_image = max(image_scores, key=image_scores.get)

    return best_image if image_scores[best_image] > 0 else "default-image.png"


@questions_routes.route("/images")
def get_question_images():
    questions = Question.query.all()
    question_images = []

    for question in questions:
        keywords = extract_keywords(question.body)
        image_filename = map_keywords_to_image(keywords)
        if image_filename:
            question_images.append({
                "question_id": question.id,
                "image_filename": image_filename
            })
    print('images***', question_images)

    return jsonify(question_images)



@questions_routes.route("/<int:question_id>/save", methods=['POST'])
@login_required
def save_question(question_id):
    try:
        # Find the question
        question = Question.query.get(question_id)
        if not question:
            return jsonify(message="Question not found"), 404

        # Add the question to the user's saved questions
        current_user.saved_questions.append(question)
        db.session.commit()

        return jsonify(message="Question saved successfully"), 200

    except Exception as e:
        print("Error saving question:", str(e))
        return jsonify(message="Internal Server Error"), 500

@questions_routes.route("/<int:question_id>/unsave", methods=['DELETE'])
@login_required
def unsave_question(question_id):
    try:
        # Find the question
        question = Question.query.get(question_id)
        if not question:
            return jsonify(message="Question not found"), 404

        # Remove the question from the user's saved questions
        current_user.saved_questions.remove(question)
        db.session.commit()

        return jsonify(message="Question unsaved successfully"), 200

    except Exception as e:
        print("Error unsaving question:", str(e))
        return jsonify(message="Internal Server Error"), 500



@questions_routes.route("/<int:question_id>", methods=['DELETE'])
@login_required
def delete_question(question_id):
    print(f"Backend received delete request for question ID: {question_id}")
    print(f"Current User ID: {current_user.id}")
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


@questions_routes.route("<int:question_id>")
def get_question(question_id):
    """returns a specific question by id"""
    question = Question.query.get(question_id)
    return jsonify(question.to_dict())




@questions_routes.route("/")
def get_all_questions():
    # Fetch all questions including related images
    questions = Question.query.all()
    all_questions = []

    for question in questions:
        question_dict = question.to_dict()

        # Fetch associated image for each question
        image = Image.query.filter_by(question_id=question.id).first()
        if image:
            question_dict["image_filename"] = image.filename

        all_questions.append(question_dict)

    return jsonify({'questions': all_questions})




@questions_routes.route('/edit/<int:question_id>', methods=['GET', 'PUT'])
@login_required

def edit_question(question_id):
    if not current_user.is_authenticated:
        return jsonify(message="You need to be logged in"), 401

    question_to_edit = Question.query.get(question_id)
    # Query the associated image
    image = Image.query.filter_by(question_id=question_id).first()

    if not question_to_edit:
        return jsonify(message="Question not found"), 404

    if question_to_edit.user_id != current_user.id:
        return jsonify(message="You cannot edit this question"), 403

    data = request.get_json()
    question_to_edit.title = data.get('title', question_to_edit.title)
    question_to_edit.body = data.get('body', question_to_edit.body)
    question_to_edit.topic_id = data.get('topic_id', question_to_edit.topic_id)

    db.session.commit()

    # Return the updated question data, including the image filename
    question_dict = question_to_edit.to_dict()
    if image:
        question_dict["image_filename"] = image.filename

    return jsonify(question=question_dict), 200
