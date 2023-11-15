// MainLayout.js
import React from 'react';
import GetTopics from '../GetTopics';
import QuestionAnswers from '../QuestionAnswers';



const MainLayout = ({ allQuestions, questionId, onUpdateQuestion, onDeleteQuestion, openDeleteModal }) => {

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <div style={{ flex: 1 }}>
                <GetTopics />
            </div>
            <div style={{ flex: 2 }}>
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
