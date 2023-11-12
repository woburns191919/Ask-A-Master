import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ConfirmDelete from "../QuestionModal/ConfirmDelete";
import { useModal } from "../../context/Modal";

import "./styles.css";
import OpenModalButton from "../OpenModalButton";

const Comments = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [answerId, setAnswerId] = useState("");
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const sessionUser = useSelector((state) => state.session.user);
  const { openModalWithComponent } = useModal();
  // console.log("open modal with componoent", openModalWithComponent);

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        const questionResponse = await fetch(`/api/questions/${id}`);
        const answersResponse = await fetch(`/api/questions/${id}/answers`);

        if (questionResponse.ok && answersResponse.ok) {
          const questionData = await questionResponse.json();
          const answersData = await answersResponse.json();

          setQuestion(questionData.body);
          // setAnswerId(answersData.id)
          setAnswers(answersData.answers);
          // console.log("answers data", answersData.answers);
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
    // console.log("Submitting edit for commentId:", commentId);

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

  const handleCommentDeletion = async (commentId) => {
    try {
      const response = await fetch(
        `/api/questions/${id}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setAnswers(answers.filter((answer) => answer.id !== commentId));
      } else {
        console.error("Failed to delete comment:", response.status);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  // useEffect(() => {
  //   console.log("Updated editingCommentId:", editingCommentId);
  // }, [editingCommentId]);

  // answers.find(answer => console.log(answer.id))
  // console.log("question id from Comments?", id);
  // console.log("editing comment id", editingCommentId);
  return (
    <div className="question-comments-container">
      <div className="question-body">{question}</div>
      <div className="answers-container">
        <div className="answer-header">Answers</div>
        {answers.map((answer) => (
          <div className="comment-container" key={answer.id}>
            <div className="comment-content">{answer.content}</div>
            <div className="comment-info">
              Answered by {answer.user_id} on{" "}
              {new Date(answer.created_at).toLocaleDateString()}
              {sessionUser && answer.user_id === sessionUser.id && (
                <>
                  <button
                    onClick={() => {
                      setEditingCommentId(answer.id);
                      // console.log("Setting editingCommentId to:", answer.id);
                      setNewComment(answer.content);
                    }}
                  >
                    Edit
                  </button>

                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={
                      <ConfirmDelete
                        commentId={answer.id}
                        onDelete={() => handleCommentDeletion(answer.id)}
                      />
                    }
                  />
                </>
              )}
            </div>
          </div>
        ))}
        <div className="comment-section">
          <input
            type="text"
            className="comment-input"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          {editingCommentId ? (
           <button className="comment-submit-button" onClick={() => submitEdit(editingCommentId)}>
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
  );
};

export default Comments;
