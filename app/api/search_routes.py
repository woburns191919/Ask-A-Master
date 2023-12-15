from flask import Blueprint, jsonify, request
from app.models import User, Question
from app.models.answer import Answer
from app.models.topic import Topic


search_routes = Blueprint('search', __name__)

@search_routes.route("/")
def search():
    query = request.args.get('query', '')  

    if not query:
        return jsonify({'message': 'No search query provided'}), 400


    questions = Question.query.filter(Question.title.ilike(f'%{query}%')).all()

    answers = Answer.query.filter(Answer.content.ilike(f'%{query}%')).all()


    topics = Topic.query.filter(Topic.name.ilike(f'%{query}%')).all()


    users = User.query.filter(User.username.ilike(f'%{query}%')).all()


    results = {
        'questions': [question.to_dict() for question in questions],
        'answers': [answer.to_dict() for answer in answers],
        'topics': [topic.to_dict() for topic in topics],
        'users': [user.to_dict() for user in users]
    }

    return jsonify(results)
