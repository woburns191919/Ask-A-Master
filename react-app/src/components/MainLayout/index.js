import React from 'react';
import GetTopics from '../GetTopics';
import QuestionAnswers from '../QuestionAnswers';
import './styles.css';

const MainLayout = ({ allQuestions, questionId, onUpdateQuestion, onDeleteQuestion, openDeleteModal }) => {
    return (
        <div className="main-layout">
            <div className="sidebar">
                <GetTopics />
            </div>
            <div className="content">
                <QuestionAnswers
                    allQuestions={allQuestions}
                    onUpdateQuestion={onUpdateQuestion}
                    onDeleteQuestion={onDeleteQuestion}
                    openDeleteModal={openDeleteModal}
                    questionId={questionId} />
            </div>
        </div>
    );
};

export default MainLayout;
