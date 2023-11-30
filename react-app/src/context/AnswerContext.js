// import React, { createContext, useContext, useState, useEffect } from 'react';

// export const AnswerContext = createContext();

// export const useAnswerContext = () => useContext(AnswerContext);

// export default function AnswerProvider({ children }) {
//   const [answers, setAnswers] = useState([]);
//   const { setModalContent } = useModal();

//   const onDeleteComment = (deletedCommentId) => {
//     setAnswers((currentAnswers) =>
//       currentAnswers.filter((answer) => answer.id !== deletedCommentId)
//     );
//   };

//   const openDeleteModal = (commentId) => {
//     setModalContent(
//       <ConfirmDelete
//         itemType="comment"
//         itemId={commentId}
//         questionId={id}
//         onDeletionSuccess={() => onDeleteComment(commentId)}
//       />
//     );
//   };

//   useEffect(() => {
//     const fetchQuestionAndAnswers = async () => {
//       try {
//         const questionResponse = await fetch(`/api/questions/${id}`);
//         const answersResponse = await fetch(`/api/questions/${id}/answers`);

//         if (questionResponse.ok && answersResponse.ok) {
//           const questionData = await questionResponse.json();
//           const answersData = await answersResponse.json();

//           setQuestion(questionData.body);
//           // setAnswerId(answersData.id)
//           setAnswers(answersData.answers);
//           // console.log("answers data", answersData.answers);
//         } else {
//           console.error(
//             "Failed to fetch question or answers:",
//             questionResponse.status,
//             answersResponse.status
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching question or answers:", error);
//       }
//     };

//     fetchQuestionAndAnswers();
//   }, [id]);

//   const postComment = async () => {
//     if (!newComment.trim()) {
//       alert("Comment cannot be empty.");
//       return;
//     }

//     try {
//       const response = await fetch(`/api/questions/${id}/comments/new`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ content: newComment }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setAnswers([...answers, data.comment]);
//         setNewComment("");
//       } else {
//         console.error("Failed to post comment:", response.status);
//       }
//     } catch (error) {
//       console.error("Error posting comment:", error);
//     }
//   };

//   const submitEdit = async (commentId) => {
//     if (!newComment.trim()) {
//       alert("Comment cannot be empty.");
//       return;
//     }
//     // console.log("Submitting edit for commentId:", commentId);

//     try {
//       const response = await fetch(
//         `/api/questions/${id}/comments/${commentId}/edit`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ content: newComment }),
//         }
//       );

//       if (response.ok) {
//         const updatedComment = await response.json();
//         setAnswers(
//           answers.map((answer) =>
//             answer.id === editingCommentId ? updatedComment.comment : answer
//           )
//         );
//         setNewComment("");
//         setEditingCommentId(null);
//       } else {
//         console.error("Failed to edit comment:", response.status);
//       }
//     } catch (error) {
//       console.error("Error editing comment:", error);
//     }
//   };



//   return (
//     <AnswerContext.Provider value={{ answers, setAnswers }}>
//       {children}
//     </AnswerContext.Provider>
//   );
// }
