from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField
from wtforms.validators import DataRequired, Length

class AddQuestionForm(FlaskForm):
    title = StringField(
        'Title',
        validators=[DataRequired(message='Title is required')]
    )
    content = TextAreaField(
        'Content',
        validators=[DataRequired(message='Content is required'), Length(min=10, message='Content must be at least 10 characters')]
    )
    is_public = SelectField(
        'Visibility',
        choices=[('public', 'Public'), ('private', 'Private')],
        default='public'
    )
