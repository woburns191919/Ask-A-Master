import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ConfirmDelete from "../QuestionModal/ConfirmDelete";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllUsers } from "../../store/session";
import GetTopics from "../GetTopics";
import RelatedTopics from "../RelatedTopics";
import magnusProfile from "../../images/magnus-profile.png";
import defaultProfile from "../../images/default-profile.png";
import UserProfileInfo from "../UserProfileInfo";
import "./styles.css";

const Comments = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const sessionUser = useSelector((state) => state.session.user);
  const allQuestions = useSelector((state) => state.questions?.allQuestions);
  const { setModalContent } = useModal();

  const dispatch = useDispatch();

  const userImages = {
    2: magnusProfile,
  };

  const users = Object.values(
    useSelector((state) =>
      state.session.allUsers ? state.session.allUsers : []
    )
  );

  useEffect(() => {
    dispatch(thunkGetAllUsers());
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;
    const foundQuestion = allQuestions?.find((q) => q.id === parseInt(id));
    if (isMounted) {
      setQuestion(foundQuestion);
    }

    return () => {
      isMounted = false;
    };
  }, [id, allQuestions]);

  const onDeleteComment = (deletedCommentId) => {
    setAnswers((currentAnswers) =>
      currentAnswers.filter((answer) => answer.id !== deletedCommentId)
    );
  };

  const openDeleteModal = (commentId) => {
    setModalContent(
      <ConfirmDelete
        itemType="comment"
        itemId={commentId}
        questionId={id}
        onDeletionSuccess={() => onDeleteComment(commentId)}
      />
    );
  };

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        const questionResponse = await fetch(`/api/questions/${id}`);
        const answersResponse = await fetch(`/api/questions/${id}/answers`);

        if (questionResponse.ok && answersResponse.ok) {
          const questionData = await questionResponse.json();
          const answersData = await answersResponse.json();

          setQuestion(questionData);
          setAnswers(answersData.answers);
        } else {
          console.error(
            "Failed to fetch question or answers:",
            questionResponse.status,
            answersResponse.status
          );
        }
      } catch (error) {
        console.error("Error fetching question or answers:", error);
      }
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

  const submitEdit = async (commentId) => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

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

      if (response.ok) {
        const updatedComment = await response.json();
        setAnswers(
          answers.map((answer) =>
            answer.id === editingCommentId ? updatedComment.comment : answer
          )
        );
        setNewComment("");
        setEditingCommentId(null);
      } else {
        console.error("Failed to edit comment:", response.status);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };
  console.log("session user", sessionUser);
  return (
    <main className="main-container">
      <div className="content-wrapper">
        <div className="sidebar sidebar-menu">
          <GetTopics />
        </div>

        <div className="center-content">
        <div className="ask-share-container">
          <div className="topic-info-container">
            {question?.title}
          </div>

          </div>
          <div className="question-comments-container">
            <div className="question-body">
              {question?.body}
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
                const answerUser = users.find(
                  (user) => user.id === answer.user_id
                );
                const userProfileImage =
                  userImages[answerUser?.id] || defaultProfile;

                return (
                  <div className="comment-container" key={answer.id}>
                    <UserProfileInfo
                      user={answerUser}
                      userProfileImage={userProfileImage}
                    />
                    <div className="comment-content">{answer.content}</div>
                    <div className="comment-info">
                      Answered on{" "}
                      {new Date(answer.created_at).toLocaleDateString()}
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
