import React, { createContext, useContext, useState } from 'react';

export const BookmarkContext = createContext();

export const useBookmarkContext = () => useContext(BookmarkContext);

export default function BookmarkProvider({ children }) {
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());

  const addBookmark = (questionId) => {
    setBookmarkedQuestions(new Set(bookmarkedQuestions.add(questionId)));
  };

  const removeBookmark = (questionId) => {
    bookmarkedQuestions.delete(questionId);
    setBookmarkedQuestions(new Set(bookmarkedQuestions));
  };

  const isBookmarked = (questionId) => {
    return bookmarkedQuestions.has(questionId);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarkedQuestions, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}
