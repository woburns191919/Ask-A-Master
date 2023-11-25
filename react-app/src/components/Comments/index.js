import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ConfirmDelete from "../QuestionModal/ConfirmDelete";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllUsers } from "../../store/session";
import "./styles.css";

const Comments = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const sessionUser = useSelector((state) => state.session.user);
  const { setModalContent } = useModal();

  const dispatch = useDispatch();

  const users = Object.values(
    useSelector((state) =>
      state.session.allUsers ? state.session.allUsers : []
    )
  );

  useEffect(() => {
    dispatch(thunkGetAllUsers());
  }, [dispatch]);

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

  // console.log('user find', users[0]?.find(user => user.id === answers[0].user_id).first_name)
  // users[0]?.map((user) => console.log("user obj id", user.id));
  // answers?.map((answer) => console.log("answer obj id", answer.id));

  return (
    <div className="question-comments-container">
      <div className="question-body">{question}</div>
      <div className="answers-container">
        <div className="answer-header">
          {answers.length === 1 ? "1 Answer" : `${answers.length} Answers`}{" "}
        </div>
        {answers.map((answer) => (
          <div className="comment-container" key={answer.id}>
            <div className="comment-content">{answer.content}</div>
            <div className="comment-info">
              Answered by{" "}
              {users.length &&
                users[0].find((user) => user.id === answer.user_id)?.first_name}
                {" "}
              on {new Date(answer.created_at).toLocaleDateString()}
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

                  <button onClick={() => openDeleteModal(answer.id)}>
                    Delete Comment
                  </button>
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
  );
};

export default Comments;
