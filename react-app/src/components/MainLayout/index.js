import React from 'react';
import GetTopics from '../GetTopics';
import QuestionAnswers from '../QuestionAnswers';
import './styles.css';

const MainLayout = ({ allQuestions, questionId, onUpdateQuestion, onDeleteQuestion, openDeleteModal }) => {
    console.log('on update question from MainLayout', onUpdateQuestion)
    return (
        <div className="main-layout">
            <div className="sidebar sidebar-menu">
                <GetTopics />
            </div>
            <div className="content main-layout">
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
