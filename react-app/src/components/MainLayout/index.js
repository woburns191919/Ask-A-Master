import React, { useEffect } from "react";
import GetTopics from "../GetTopics";
import QuestionAnswers from "../QuestionAnswers";
import AskShareComponent from "../AskShareInput";

import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllUsers } from "../../store/session";
import RelatedTopics from "../RelatedTopics";
import { useParams } from "react-router-dom";
import TopicInfo from "../TopicInfo";
import { useLocation } from "react-router-dom";

//determines how main content is structured and which components are shown
//, based on state and user interactions
//can update this without changing CommonLayout
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
  const { id: topicId } = useParams();

  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  useEffect(() => {
    dispatch(thunkGetAllUsers());
  }, [dispatch]);

  return (
    <>
      <div className="content-wrapper">
        <div className="left-content">
        <GetTopics />
        </div>


        <div className="center-content">
          {sessionUser && (
            <div className="ask-share-container">
              {topicId ? (
                <TopicInfo topicId={topicId} /> //component mounts when logged-in user clicks topic
              ) : (
                <AskShareComponent handleAddQuestion={handleAddQuestion} /> //component mounts when logged-in user is on main page
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
        {/* {isMainPage ? (
          <RelatedTopics showAds={true} />
        ) : (
          <RelatedTopics showAds={false} />
        )} */}
        {/* refactor for concision, leveraging isMainPage being a boolean */}
           <RelatedTopics showAds={isMainPage} />
      </div>
    </>
  );
};
export default MainLayout;
