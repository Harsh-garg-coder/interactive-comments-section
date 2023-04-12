import { useEffect, useState } from 'react';
import './App.css';
import data from "./data";
import Comments from "./components/Comments";
import AddNewComment from "./components/AddNewComment";
import uuid from "react-uuid";
import Modal from "./components/Modal";
import crossIcon from "./images/icon-cross.png";

let initialData = localStorage.getItem("interactive-comment-section-data");

if(!initialData) {
  initialData = data;
} else {
  initialData = JSON.parse(initialData);
}

export default function App() {
  const [comments, setComments] = useState(initialData.comments);
  const [currentUser, setCurrentUser] = useState(initialData.currentUser);
  const [showModal, setShowModal] = useState(false);
  const [idOfCommentToDelete, setIdOfCommentToDelete] = useState(null);
  const [parentIdOfCommentToDelete, setParentIdOfCommentToDelete] = useState(null);
  const [showUndoButton, setShowUndoButton] = useState(false);
  const [prevComments, setPrevComments] = useState("");

  const addComment = function (text) {
    try {
      if(!text) return;

      const newComment = {
        "id": uuid(),
        "content": text,
        "score": 0,
        "user": {...currentUser},
        "replies": [], 
      };

      setComments((prevComments) => {
        return [...prevComments, newComment];
      });
    } catch(error) {
      console.log(error);
    }
  }

  const deleteComment = function () {
    try {
      const id = idOfCommentToDelete;
      const parentId = parentIdOfCommentToDelete;

      setPrevComments(comments);

      if(parentId) {
        // deleting reply
        setComments((currentComments) => {
          return currentComments.map((currentComment) => {
            if(currentComment.id !== parentId) {
              return currentComment;
            }

            const newComment = {...currentComment};
            newComment.replies = newComment.replies.filter((currentReply) => {
              if(currentReply.id === id) return false;
              return true;
            });

            return newComment;
          })
        });

      } else {
        // deleting comment
        setComments((prevComments) => {
          return prevComments.filter((currentComment) => {
            if(currentComment.id === id) return false;
            return true;
          })
        });

      }

      setShowUndoButton(true);

      setInterval(() => {
        setShowUndoButton(false);
      }, 5000);

    } catch(error) {
      console.log(error);
    }
  }

  const sortCommentsOnVotes = function () {
    setComments((currentComments) => {
      return currentComments.sort((a, b) => {
        return -(a.score - b.score);
      });
    })
  }

  const changeVote = function (count, id, parentId) {
    try {
      if(parentId) {
        // changing the vote of reply
        setComments((currentComments) => {
          return currentComments.map((currentComment) => {
            if(currentComment.id !== parentId) {
              return currentComment;
            }

            const newComment = {...currentComment};

            newComment.replies = newComment.replies.map((currentReply) => {
              if(currentReply.id === id) {
                const newReply = {...currentReply};

                if(newReply.score === 0 && count === -1) return newReply;

                newReply.score += count;

                return newReply;
              }

              return currentReply;
            });

            return newComment;
          })
        });
        
      } else {
        //  changing the vote of a comment
        setComments((currentComments) => {
          return currentComments.map((currentComment) => {
            if(currentComment.id === id) {
              const newComment = {...currentComment};

              if(newComment.score === 0 && count === -1) return newComment;

              newComment.score += count;
              return newComment;
            } 
            return currentComment;
          });
        });
      }

      sortCommentsOnVotes();
    } catch(error) {
      console.log(error);
    }
  }

  const updateContent = function (newContent, id, parentId) {
    try {
      if(parentId) {
        // update reply
        setComments((currentComments) => {
          return currentComments.map((currentComment) => {
            
            if(currentComment.id !== parentId) {
              return currentComment;
            }

            const newComment = {...currentComment};

            newComment.replies = newComment.replies.map((currentReply) => {
              if(currentReply.id !== id) {
                return currentReply;
              }

              const newReply = {...currentReply};

              newReply.content = newContent;

              return newReply;
            });

            return newComment;
          })
        })
      } else {
        //  update comment
        setComments((currentComments) => {
          return currentComments.map((currentComment) => {
            if(currentComment.id !== id) {
              return currentComment;
            }

            const newComment = {...currentComment};
            newComment.content = newContent;

            return newComment;
          })
        })
      }
    } catch(error) {

    }
  }

  const addReply = function (content, replyingTo, commentId) {
    try{
      if(!content) return;
      setComments((currentComments) => {
        return currentComments.map((currentComment) => {
          if(currentComment.id !== commentId) {
            return currentComment;
          }

          const newComment = {...currentComment};

          const newReply = {
            "id": uuid(),
            "content": content,
            "score": 0,
            "replyingTo": replyingTo,
            "user": currentUser
          }

          newComment.replies = [...newComment.replies, newReply];

          return newComment;
        });
      })
    } catch(error) {
      console.log(error);
    }
  }

  const undoDelete = function () {
    setComments([...prevComments]);
    setShowUndoButton(false);
  }
  
  const hideUndoButton = function () {
    setShowUndoButton(false);
  }

  useEffect(() => {
    sortCommentsOnVotes();
  }, []);

  useEffect(() => {
    if(!showUndoButton) {
      setPrevComments([]);
    }
  }, [showUndoButton])

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
            onClick = {hideUndoButton}
          />
        </div>
      }
      <Comments 
        comments = {comments}
        deleteComment = {() => setShowModal(true)}
        setIdOfCommentToDelete = {setIdOfCommentToDelete}
        setParentIdOfCommentToDelete = {setParentIdOfCommentToDelete}
        changeVote = {changeVote}
        currentUser = {currentUser}
        updateContent = {updateContent}
        profileUrl = {currentUser.image.webp}
        addReply = {addReply}
      />

      <AddNewComment 
        profileUrl = {currentUser.image.webp}
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
