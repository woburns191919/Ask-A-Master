from flask.cli import AppGroup
from .users import seed_users, undo_users
from .questions import seed_questions, undo_questions
from .answers import seed_answers, undo_answers
from .topics import seed_topics, undo_topics

from app.models.db import db, environment, SCHEMA


seed_commands = AppGroup('seed')



@seed_commands.command('all')
def seed():
    if environment == 'production':
        undo_answers()
        undo_questions()
        undo_topics()
        undo_users()

    seed_users()
    seed_topics()
    seed_questions()
    seed_answers()


@seed_commands.command('undo')
def undo():
    undo_answers()
    undo_questions()
    undo_topics()
    undo_users()
