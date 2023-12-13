import React, { useEffect } from "react";
import GetTopics from "../GetTopics";
import QuestionAnswers from "../QuestionAnswers";
import AskShareComponent from "../AskShareInput";
// import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllUsers } from "../../store/session";
import RelatedTopics from "../RelatedTopics";
import { useParams } from "react-router-dom";
import TopicInfo from "../TopicInfo";
import { useLocation } from "react-router-dom";

const MainLayout = ({
  allQuestions,
  images,
  questionId,
  onUpdateQuestion,
  onDeleteQuestion,
  openDeleteModal,
  handleAddQuestion,
  handleTopicCreated,
  handleQuestionsUpdate,
}) => {
  const { id: topicId } = useParams(); //  undefined on main page

  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  useEffect(() => {
    dispatch(thunkGetAllUsers());
  }, [dispatch]);
  console.log("images from main", images);

  return (
    <div className="main-layout">
      <div className="upper-layout"></div>
      <div className="content-wrapper">
        <div className="sidebar sidebar-menu">
          {/* <GetTopics handleTopicCreated={handleTopicCreated}/> */}
        </div>
        <div className="content">
          {sessionUser && (
            <div className="ask-share-container question-answer-box">
              {topicId ? (
                <TopicInfo topicId={topicId} />
              ) : (
                <AskShareComponent handleAddQuestion={handleAddQuestion} />
              )}
            </div>
          )}
          <QuestionAnswers
            allQuestions={allQuestions}
            onUpdateQuestion={onUpdateQuestion}
            onDeleteQuestion={onDeleteQuestion}
            openDeleteModal={openDeleteModal}
            questionId={questionId}
            images={images}
            handleQuestionsUpdate={handleQuestionsUpdate}
          />
        </div>
        {isMainPage ? (
          <RelatedTopics showAds={true} />
        ) : (
          <RelatedTopics showAds={false} />
        )}
      </div>
    </div>
  );
};
export default MainLayout;
