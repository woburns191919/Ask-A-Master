// import React, { useState } from 'react';
// import { useModal } from '../../context/Modal';

// function VersatileModalContent({ feature, handleFormSubmit }) {
//   const { closeModal } = useModal();
//   const [activeTab, setActiveTab] = useState('');
//   const [questionData, setQuestionData] = useState({
//     title: '',
//     body: '',
//   });
//   const [postData, setPostData] = useState({
//     content: '',
//   });

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   };

//   const handleAddQuestionSubmit = () => {
//     // Handle the submit logic for adding a question here
//     // You can access the questionData state for the data
//     handleFormSubmit('addQuestion', questionData);
//     closeModal();
//   };

//   const handleCreatePostSubmit = () => {
//     // Handle the submit logic for creating a post here
//     // You can access the postData state for the data
//     handleFormSubmit('createPost', postData);
//     closeModal();
//   };

//   return (
//     <div>
//       <div className="modal-tabs">
//         <button
//           className={activeTab === 'addQuestion' ? 'active' : ''}
//           onClick={() => handleTabChange('addQuestion')}
//         >
//           Add Question
//         </button>
//         <button
//           className={activeTab === 'createPost' ? 'active' : ''}
//           onClick={() => handleTabChange('createPost')}
//         >
//           Create Post
//         </button>
//       </div>
//       <div className="modal-content">
//         {activeTab === 'addQuestion' && (
//           <div>
//             <input
//               type="text"
//               placeholder="Title"
//               value={questionData.title}
//               onChange={(e) =>
//                 setQuestionData({ ...questionData, title: e.target.value })
//               }
//             />
//             <textarea
//               placeholder="Your question"
//               value={questionData.body}
//               onChange={(e) =>
//                 setQuestionData({ ...questionData, body: e.target.value })
//               }
//             />
//             <button onClick={handleAddQuestionSubmit}>Submit Question</button>
//           </div>
//         )}
//         {activeTab === 'createPost' && (
//           <div>
//             <textarea
//               placeholder="What's on your mind?"
//               value={postData.content}
//               onChange={(e) =>
//                 setPostData({ ...postData, content: e.target.value })
//               }
//             />
//             <button onClick={handleCreatePostSubmit}>Create Post</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default VersatileModalContent;
