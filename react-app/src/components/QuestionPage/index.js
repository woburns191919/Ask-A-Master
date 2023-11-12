// QuestionPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import Comments from './Comments';

const QuestionPage = () => {
    const { id: questionId } = useParams();

    return <Comments questionId={questionId} />;
};

export default QuestionPage;
