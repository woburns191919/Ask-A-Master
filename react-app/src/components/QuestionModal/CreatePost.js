// import React, { useState } from 'react';

// export default function CreatePostForm({ onSubmit }) {
//   const [content, setContent] = useState('');

//   const handleSubmit = () => {
//       // Validate and submit the post content
//       if (content) {
//           onSubmit({ content });
//       }
//   };

//   return (
//       <div>
//           <select>
//               {/* Dropdown options for credentials */}
//           </select>
//           <textarea
//               placeholder="Say something..."
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//           />
//           <button onClick={handleSubmit}>Create Post</button>
//       </div>
//   );
// }
