from flask import Blueprint, jsonify, request
import openai
import os

gpt_routes = Blueprint('gpt', __name__)


openai.api_key = os.getenv('OPENAI_API_KEY')

@gpt_routes.route('/api/gpt-response', methods=['POST'])
def gpt_response():
    data = request.get_json()
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400


    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens=100,
        temperature=0.7
    )

    return jsonify({'response': response.choices[0].text})
