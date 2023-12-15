import React, { useRef, useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const ModalContext = React.createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);

  const [onCloseCallback, setOnCloseCallback] = useState(null);

  const closeModal = () => {
    setModalContent(null); // clear the modal contents
    if (onCloseCallback) {
      onCloseCallback(); // Execute the callback if it exists
    }
    setOnCloseCallback(null); // Reset the callback
  };
  useEffect(() => {}, [modalContent]);

  // Updated context value to include setOnCloseCallback
  const contextValue = {
    modalRef,
    modalContent,
    setModalContent,
    setOnCloseCallback, // New addition
    closeModal,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <div ref={modalRef} />
    </ModalContext.Provider>
  );
}

export function Modal() {
  const { modalRef, modalContent, closeModal } = useContext(ModalContext);

  if (!modalRef.current || !modalContent) return null;

  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content">{modalContent}</div>
    </div>,
    modalRef.current
  );
}

export const useModal = () => useContext(ModalContext);
