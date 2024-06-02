from flask import Blueprint, jsonify, request
import openai
import os

gpt_routes = Blueprint('gpt', __name__)


openai.api_key = os.getenv('OPENAI_API_KEY')

@gpt_routes.route('/gpt-response', methods=['POST'])
def gpt_response():
    data = request.get_json()
    print('data from post', data)
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400


    response = openai.Completion.create(
        model="gpt-3.5-turbo",
        prompt="Short prompt",
        max_tokens=50,
        temperature=0.7
    )
    print('response', response)

    return jsonify({'response': response.choices[0].text})
