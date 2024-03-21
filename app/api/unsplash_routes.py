from flask import Blueprint, jsonify
from dotenv import load_dotenv
import os

load_dotenv()

AI_UNSPLASH_API_KEY = os.getenv('AI_UNSPLASH_API_KEY')

unsplash_routes = Blueprint('unsplash', __name__)


@unsplash_routes.route('/key', methods=['POST'])
def get_unsplash_key():
    if not AI_UNSPLASH_API_KEY:
        return jsonify({'error': 'API key not available'}), 500

    return jsonify({'AIUnsplashAPIKey': AI_UNSPLASH_API_KEY})
