import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ConfirmDelete from "../QuestionModal/ConfirmDelete";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllUsers } from "../../store/session";
import GetTopics from "../GetTopics";
import RelatedTopics from "../RelatedTopics";
import defaultProfile from "../../images/default-profile.png";
// import UserProfileInfo from "../UserProfileInfo";
import "./styles.css";

import willProfile from "../../images/wbheadshot.jpg";
import magnusProfile from "../../images/magnus-profile.png";
import garryProfile from "../../images/garry.jpg";
import anandProfile from "../../images/anand.png";
import bobbyProfile from "../../images/bobby.jpg";
import kramnikProfile from "../../images/kramnik.jpg";
import karpovProfile from "../../images/karpov.jpg";
import talProfile from "../../images/tal.jpg";
import fabProfile from "../../images/fab.jpg";
import hikaruProfile from "../../images/hikaru.jpg";
import levonProfile from "../../images/levon.jpg";

const Comments = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const sessionUser = useSelector((state) => state.session.user);
  // const allQuestions = useSelector((state) => state.questions?.allQuestions);
  const { setModalContent } = useModal();

  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(thunkGetAllUsers());
  }, [dispatch]);
  //1. component dispatches thunkGetAllUsers()

//6. after redux store updates, we get that info here
// any component connected to the store (specifially, allUsers slice of state)
// receive updated list of users as props
  const users = Object.values(
    useSelector((state) =>
      state.session.allUsers ? state.session.allUsers : []
    )
  );

 // Fetch the specific question and answers from the API
 useEffect(() => {
  const fetchQuestionAndAnswers = async () => {
    // Fetch the question
    const questionRes = await fetch(`/api/questions/${id}`);
    if (!questionRes.ok) {
      console.error("Failed to fetch question.");
      return;
    }
    const questionData = await questionRes.json();
    setQuestion(questionData);

    // Fetch the answers
    const answersRes = await fetch(`/api/questions/${id}/answers`);
    if (!answersRes.ok) {
      console.error("Failed to fetch answers.");
      return;
    }
    const answersData = await answersRes.json();
    setAnswers(answersData.answers);
  };

  fetchQuestionAndAnswers();
}, [id]);


  const postComment = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`/api/questions/${id}/comments/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });
//should clear up comments/answers in refactor
      if (response.ok) {
        const data = await response.json();
        setAnswers([...answers, data.comment]);
        setNewComment("");
      } else {
        console.error("Failed to post comment:", response.status);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

//currently, such functions (delete, post, edit comment) are close to the component--I'm only displaying comments on a single page
  const onDeleteComment = (deletedCommentId) => {
    setAnswers((currentAnswers) =>
      currentAnswers.filter((answer) => answer.id !== deletedCommentId)
    );
  };

  const openDeleteModal = (commentId) => { // handles case when user initiates a delete action for a comment;
    //reusable modal system, using context to manage state
    setModalContent(
      <ConfirmDelete
        itemType="comment"
        itemId={commentId}
        questionId={id}
        onDeletionSuccess={() => onDeleteComment(commentId)}
      />
    );
  };

  const submitEdit = async (commentId) => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
//4. API request to update comment at endpoint below

    try {
      const response = await fetch(
        `/api/questions/${id}/comments/${commentId}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      //5. server processes the request, updates the comment in the db with the new content,
      //and returns the updated comment data as a response

      if (response.ok) {
        const updatedComment = await response.json();
        //6. updating answer state
        //7. re-render!
        setAnswers(
          answers.map((answer) =>
            answer.id === editingCommentId ? updatedComment.comment : answer
          )
        );
        //after submitting new comment, this clears the input field for adding a new comment or editing an existing one.
        setNewComment("");
        //indicates we're no longer in the editing mode
        setEditingCommentId(null);
      } else {
        console.error("Failed to edit comment:", response.status);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };
  const userImages = {
    1: willProfile,
    2: magnusProfile,
    3: garryProfile,
    4: anandProfile,
    5: bobbyProfile,
    6: kramnikProfile,
    7: karpovProfile,
    8: talProfile,
    9: fabProfile,
    10: hikaruProfile,
    11: levonProfile,
  };

  return (
    <main className="main-container">
      <div className="content-wrapper">
        <div className="sidebar sidebar-menu">
          <GetTopics />
        </div>

        <div className="center-content">
          <div className="ask-share-container">
            <div className="topic-info-container">
              {console.log('question array?', question)}
                <h2>{question?.title}
              </h2>
            </div>
          </div>
          <div className="question-comments-container">
            <div>
            <div className="question-body">
            <div className="user-profile-container">

    <img
      src={userImages[question?.user_id] || defaultProfile}
      className="user-profile-image"
      alt="Profile"
    />
    <div className="user-credentials">
      <div className="user-name">

        {users[0]?.find((user) => user.id === question?.user_id)?.first_name}{" "}
        {users[0]?.find((user) => user.id === question?.user_id)?.last_name}
      </div>
      <div className="elo-rating">

        ELO Rating{" "}
        <span>
          {
            users[0]?.find((user) => user.id === question?.user_id)
              ?.elo_rating
          }
        </span>
      </div>
    </div>
  </div>
              <p className="question-content">
              {question?.body}
                </p>
              </div>
              {question?.image_filename && (
                <img
                  className="question-photo"
                  src={`/${question.image_filename}`}
                  alt="Question"
                  style={{ height: "400px" }}
                />
              )}
            </div>
            <div className="answers-container">
              {answers.map((answer) => {
                const answerUser = users[0]?.find(
                  (user) => user.id === answer.user_id
                );
                const userProfileImage =
                  userImages[answerUser?.id] || defaultProfile;

                return (
                  <div className="comment-container" key={answer.id}>
                    <div className="user-profile-container">
                      <img
                        src={userProfileImage || defaultProfile}
                        className="user-profile-image"
                        alt="Profile"
                      />
                      <div className="user-credentials">
                        <div className="user-name">
                          {
                            users[0]?.find((user) => user.id === answer.user_id)
                              ?.first_name
                          }{" "}
                          {
                            users[0]?.find((user) => user.id === answer.user_id)
                              ?.last_name
                          }
                        </div>
                        <div className="elo-rating">
                          ELO Rating{" "}
                          <span>
                            {
                              users[0]?.find(
                                (user) => user.id === answer.user_id
                              )?.elo_rating
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="comment-content">{answer.content}</div>
                    <div className="comment-info">
                      Answered by{" "}
                      {
                        users[0]?.find((user) => user.id === answer.user_id)
                          ?.first_name
                      }{" "}
                      on {new Date(answer.created_at).toLocaleDateString()}
                      {sessionUser && answer.user_id === sessionUser.id && (
                        <>
                          <button
                            onClick={() => {
                              // 1. The user clicks on an "Edit" button associated with a comment, which triggers an event handler.
                              //It sets the editingCommentId state with the ID of the comment that the user intends to edit, pre-populates newComment with content.
                              //2. The user modifies the comment's content in the input field (bound to newComment state).
                              setEditingCommentId(answer.id);
                              setNewComment(answer.content);
                            }}
                          >
                            Edit
                          </button>
                          <button onClick={() => openDeleteModal(answer.id)}>
                            Delete Comment
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="comment-section">
              <input
                type="text"
                className="comment-input"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              {editingCommentId ? (
                <button
                  className="comment-submit-button"
                  onClick={() => submitEdit(editingCommentId)}
                >
                  Save Edit
                  {/* 3. submitEdit function is called with the commentId of the comment being edited. */}
                </button>
              ) : (
                <button className="comment-submit-button" onClick={postComment}>
                  Comment
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="related-topics-main-container">
          <RelatedTopics showAds={true} />
        </div>
      </div>
    </main>
  );
};

export default Comments;
