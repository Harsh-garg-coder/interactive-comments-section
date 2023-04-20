import { useEffect, useState } from 'react';
import './App.css';
import { currentUserData , commentsData } from './data';
import Comments from "./components/Comments";
import AddNewComment from "./components/AddNewComment";
import uuid from "react-uuid";
import Modal from "./components/Modal";
import crossIcon from "./images/icon-cross.png";

export default function App() {
  const [comments, setComments] = useState(commentsData);
  const [showModal, setShowModal] = useState(false);
  const [idOfCommentToDelete, setIdOfCommentToDelete] = useState(null);
  const [parentIdOfCommentToDelete, setParentIdOfCommentToDelete] = useState(null);
  const [showUndoButton, setShowUndoButton] = useState(false);
  const [prevComments, setPrevComments] = useState("");

  const addComment = function (text) {
    try {
      if(!text) return;

      const commentId = uuid();

      const newComment = {
        "id": commentId,
        "content": text,
        "score": 0,
        "user": {...currentUserData}
      };

      setComments((prevComments) => {
        const newComments = {...prevComments};

        newComments[null].push(newComment);

        return newComments;
      });

    } catch(error) {
      console.log(error);
    }
  }

  const deleteComment = function () {
    try {
      const id = idOfCommentToDelete;
      const parentId = parentIdOfCommentToDelete ?? null;


      setPrevComments(comments);

      setComments((prevComments) => {
        const newComments = {...prevComments};

        newComments[parentId] = newComments[parentId].filter((currentComment) => {
          if(currentComment.id === id) return false;
          return true;
        });

        return newComments;
      });

      setShowUndoButton(true);

      setInterval(() => {
        setShowUndoButton(false);
      }, 5000);

    } catch(error) {
      console.log(error);
    }
  }

  const sortCommentsOnVotes = function () {
    try {
      setComments((currentComments) => {
        const newComments = {...currentComments};
  
        for(let parentId in newComments) {
          newComments[parentId] = newComments[parentId].sort((a, b) => {
            return -(a.score - b.score);
          })
        }
  
        return newComments;
      });
    } catch(error) {
      console.log(error);
    } 
  }

  const changeVote = function (count, id, parentId) {
    try {
      parentId = parentId ?? null;

      setComments((prevComments) => {
        const newComments = {...prevComments};

        newComments[parentId] = newComments[parentId].map((currentComment) => {
          if(currentComment.id === id) {
            return {...currentComment, score : currentComment.score + count}
          }
          return currentComment;
        });

        return newComments;
      });
      sortCommentsOnVotes();
    } catch(error) {
      console.log(error);
    }
  }

  const updateContent = function (newContent, id, parentId) {
    try {
      parentId = parentId ?? null;

      setComments((prevComments) => {
        const newComments = {...prevComments};

        newComments[parentId] = newComments[parentId].map((currentComment) => {
          if(currentComment.id !== id) return currentComment;

          currentComment.content = newContent;
          return currentComment;
        });

        return newComments;
      });
    } catch(error) {
      console.log(error);
    }
  }

  const addReply = function (content, parentUserName, parentId) {
    try{
      if(!content) return;

      const newReply = {
        "id": uuid(),
        "content": content,
        "score": 0,
        "replyingTo": parentUserName,
        "user": currentUserData
      }

      setComments((prevComments) => {
        const newComments = {...prevComments};

        if(!newComments[parentId]) {
          newComments[parentId] = [];
        }

        newComments[parentId].push(newReply);

        return newComments;
      });
    } catch(error) {
      console.log(error);
    }
  }

  const undoDelete = function () {
    try {
      setComments({...prevComments});
      setShowUndoButton(false);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    sortCommentsOnVotes();
  }, []);

  useEffect(() => {
    if(!showUndoButton) {
      setPrevComments([]);
    }
  }, [showUndoButton])

  const rootComments = comments[null];

  return (
    <div className="app-container">
      {
        showUndoButton && 
        <div className = "undo-container">
          <button 
            className = "blue-btn"
            onClick = {undoDelete}
          >Undo Delete</button>
          <img 
            src = {crossIcon}
            onClick = {() => setShowUndoButton(false)}
          />
        </div>
      }

      <Comments 
        rootComments = {rootComments}
        comments = {comments}
        showDeleteModal = {() => setShowModal(true)}
        setIdOfCommentToDelete = {setIdOfCommentToDelete}
        setParentIdOfCommentToDelete = {setParentIdOfCommentToDelete}
        changeVote = {changeVote}
        currentUser = {currentUserData}
        updateContent = {updateContent}
        addReply = {addReply}
      />

      <AddNewComment 
        profileUrl = {currentUserData.image.webp}
        add = {addComment}
      />

      {
        showModal && 
        <Modal>
          <div className = "delete-modal-container">
            <h3>Delete comment</h3>
            <p>Are you sure you want to delete this comment? This will remove the comment and cant be undone</p>
            <div className = "delete-modal-controllers">
              <button 
                className = "cancel-delete-btn"
                onClick = {() => setShowModal(false)}
              >
                NO,CANCEL
              </button>
              <button 
                className = "delete-btn"
                onClick = {() => {
                  deleteComment();
                  setShowModal(false);
                }}
              >
                YES,DELETE
              </button>
            </div>
          </div>
        </Modal>
      }
      
    </div>
  );
}
