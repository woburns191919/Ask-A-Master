from flask import Blueprint, jsonify, request, redirect, url_for, abort
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User, Question, db
from app.models.answer import Answer
from app.forms import question_form
from app.models.image import Image
import spacy
from random import randint


questions_routes = Blueprint('questions', __name__)

nlp = spacy.load("en_core_web_sm")

def extract_keywords(text):
    """ Extract keywords from the text """
    doc = nlp(text)
    return [token.lemma_ for token in doc if token.pos_ in ["NOUN", "PROPN"]]

default_images = ["analysis2.jpg", "blunder2.png", "fischer2.jpg"]
def map_keywords_to_image(keywords):
    print("Function map_keywords_to_image called with keywords:", keywords)
    keyword_to_image = {
        "blunder": ["blunder2.png"],
        "analysis": ["analysis2.jpg"],
        "structure": ["structure2.jpg"],
        "analyze": ["analyze2.jpg"],
        "bishop": ["bishop2.png"],
        "pawn": ["pawn2.jpg"],
        "genius": ["magnus2.jpg"]
    }


    image_scores = {image: 0 for images in keyword_to_image.values() for image in images}

    print("Keywords:", keywords)
    print("Keyword to Image Mapping:", keyword_to_image)
    print("Initial Image Scores:", image_scores)


    for keyword in keywords:
        for image in keyword_to_image.get(keyword, []):
            image_scores[image] += 1

    print("Updated Image Scores:", image_scores)


    best_image = max(image_scores, key=image_scores.get)

    print("Best Image:", best_image)
    if image_scores[best_image] == 0:
        random_index = randint(0, len(default_images) - 1)
        return default_images[random_index]
    else:
        return best_image



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

        question = Question.query.get(question_id)
        if not question:
            return jsonify(message="Question not found"), 404


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

        question = Question.query.get(question_id)
        if not question:
            return jsonify(message="Question not found"), 404


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

        if not current_user.is_authenticated:
            return jsonify(message="You need to be logged in"), 401


        question_to_delete = Question.query.get(question_id)


        if not question_to_delete:
            return jsonify(message="Question not found"), 404


        if str(question_to_delete.user_id) != str(current_user.id):
            print("User is not the owner of the question")
            print('question to del id, cur user id', question_to_delete.user_id, current_user.id)
            return jsonify(message="You cannot delete this question"), 403


        db.session.delete(question_to_delete)
        db.session.commit()

        return jsonify(message="Question deleted successfully"), 200

    except Exception as e:

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
    print("Received data for new question:", data)

    title = data.get('title', '')
    body = data.get('body', '')
    user_id = data.get('user_id')
    topic_id = data.get('topic_id', 1)


    keywords = extract_keywords(body)

    image_filename = map_keywords_to_image(keywords)


    new_question = Question(
        title=title,
        body=body,
        user_id=user_id,
        topic_id=topic_id
    )
    db.session.add(new_question)
    db.session.commit()


    new_image = Image(filename=image_filename, question_id=new_question.id)
    db.session.add(new_image)
    db.session.commit()


    return jsonify({
        'message': 'Question created successfully',
        'question': new_question.to_dict(),
        'image_filename': image_filename
    }), 201



@questions_routes.route("<int:question_id>")
def get_question(question_id):
    question = Question.query.get(question_id)
    if not question:
        return jsonify({"message": "Question not found"}), 404

    question_dict = question.to_dict()

    images = Image.query.filter_by(question_id=question_id).all()
    question_dict["image_filenames"] = [image.filename for image in images]

    return jsonify(question=question_dict)



@questions_routes.route("/")
def get_all_questions():
    questions = Question.query.all()
    all_questions = []

    for question in questions:
        question_dict = question.to_dict()


        images = Image.query.filter_by(question_id=question.id).all()
        question_dict["image_filenames"] = [img.filename for img in images]

        print('Question data:', question_dict)
        all_questions.append(question_dict)

    return jsonify({'questions': all_questions})





@questions_routes.route('/edit/<int:question_id>', methods=['GET', 'PUT'])
@login_required

def edit_question(question_id):
    if not current_user.is_authenticated:
        return jsonify(message="You need to be logged in"), 401

    question_to_edit = Question.query.get(question_id)

    image = Image.query.filter_by(question_id=question_id).first()

    if not question_to_edit:
        return jsonify(message="Question not found"), 404

    if question_to_edit.user_id != current_user.id:
        return jsonify(message="You cannot edit this question"), 403

    data = request.get_json()
    print("Received data for editing question:", data)
    question_to_edit.title = data.get('title', question_to_edit.title)
    question_to_edit.body = data.get('body', question_to_edit.body)
    question_to_edit.topic_id = data.get('topic_id', question_to_edit.topic_id)

    db.session.commit()


    question_dict = question_to_edit.to_dict()
    if image:
        question_dict["image_filename"] = image.filename

    return jsonify(question=question_dict), 200
