import React, { useEffect } from "react";
import GetTopics from "../GetTopics";
import QuestionAnswers from "../QuestionAnswers";
import AskShareComponent from "../AskShareInput";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllUsers } from "../../store/session";

const MainLayout = ({
  topicId,
  allQuestions,
  questionId,
  onUpdateQuestion,
  onDeleteQuestion,
  openDeleteModal,
}) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(thunkGetAllUsers());
  }, [dispatch]);


  return (
    <div className="main-layout">
      {sessionUser && (
        <div className="ask-share-container">
          <AskShareComponent />
        </div>
      )}
      <div className="content-sidebar-wrapper">
        <div className="sidebar sidebar-menu">
          <GetTopics />
        </div>
        <div className="content">
          <QuestionAnswers
            allQuestions={allQuestions}
            onUpdateQuestion={onUpdateQuestion}
            onDeleteQuestion={onDeleteQuestion}
            openDeleteModal={openDeleteModal}
            questionId={questionId}
          />
        </div>
      </div>
    </div>
  );
};
export default MainLayout;
