import React, { useEffect } from "react";
import GetTopics from "../GetTopics";
import QuestionAnswers from "../QuestionAnswers";
import AskShareComponent from "../AskShareInput";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllUsers } from "../../store/session";
import RelatedTopics from "../RelatedTopics";
import { useParams } from 'react-router-dom';
import TopicInfo from "../TopicInfo";


const MainLayout = ({
  allQuestions,
  questionId,
  onUpdateQuestion,
  onDeleteQuestion,
  openDeleteModal,
  handleAddQuestion,
  handleTopicCreated
}) => {
  const { id: topicId } = useParams(); //  undefined on main page

  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(thunkGetAllUsers());
  }, [dispatch]);

  return (
    <div className="main-layout">
      <div className="upper-layout">
      </div>
      <div className="content-wrapper">
        <div className="sidebar sidebar-menu">
          <GetTopics handleTopicCreated={handleTopicCreated}/>
        </div>
        <div className="content">
        {sessionUser && (
      <div className="ask-share-container">
        {topicId ? <TopicInfo topicId={topicId} /> : <AskShareComponent handleAddQuestion={handleAddQuestion}/>}
      </div>
    )}
          <QuestionAnswers
            allQuestions={allQuestions}
            onUpdateQuestion={onUpdateQuestion}
            onDeleteQuestion={onDeleteQuestion}
            openDeleteModal={openDeleteModal}
            questionId={questionId}
            handleTopicCreated={handleTopicCreated}

          />
        </div>
        <div className="related-topics">
          <RelatedTopics />
        </div>
      </div>
    </div>
  );
};
export default MainLayout

// allQuestions={allQuestions}
// onUpdateQuestion={onUpdateQuestion}
// onDeleteQuestion={onDeleteQuestion}
// openDeleteModal={openDeleteModal}
// questionId={questionId}
