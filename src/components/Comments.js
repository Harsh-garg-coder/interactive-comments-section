import styles from "../styles/Comments.module.css";
import Comment from "./Comment";

export default function Comments(props) {
    const handleDelete = function (id, parentId) {
        props.setIdOfCommentToDelete(id);
        props.setParentIdOfCommentToDelete(parentId)
        props.deleteComment();
    }

    return (
        <div className = {styles["comments-container"]}>
            {
                props.comments.map((currentComment) => {
                    return (
                        <div 
                            key = {currentComment.id} 
                        >
                            <Comment 
                                isCurrentUser = {props.currentUser.username === currentComment.user.username}
                                commentData = {currentComment}
                                // deleteComment = {() => props.deleteComment(currentComment.id)}
                                deleteComment = {props.deleteComment}
                                setIdOfCommentToDelete = {props.setIdOfCommentToDelete}
                                setParentIdOfCommentToDelete = {props.setParentIdOfCommentToDelete}
                                upVote = {() => props.changeVote(1, currentComment.id)}
                                downVote = {() => props.changeVote(-1, currentComment.id)}
                                handleDelete = {() => handleDelete(currentComment.id)}
                                updateContent = {(newContent) => props.updateContent(newContent, currentComment.id)}
                                addReply = {(content) => props.addReply(content, currentComment.user.username, currentComment.id)}
                                profileUrl = {props.profileUrl}
                            />
                            {
                                currentComment.replies.length > 0 && 
                                <div className = {styles["replies-container"]}>
                                    {
                                        currentComment.replies.map((currentReply) => {
                                            return (
                                                <Comment 
                                                    isCurrentUser = {props.currentUser.username === currentReply.user.username}
                                                    commentData = {currentReply}
                                                    deleteComment = {() => props.deleteComment(currentReply.id, currentComment.id)}
                                                    upVote = {() => props.changeVote(1, currentReply.id, currentComment.id)}
                                                    downVote = {() => props.changeVote(-1, currentReply.id, currentComment.id)}
                                                    setIdOfCommentToDelete = {props.setIdOfCommentToDelete}
                                                    setParentIdOfCommentToDelete = {props.setParentIdOfCommentToDelete}
                                                    handleDelete = {() => handleDelete(currentReply.id, currentComment.id)}
                                                    updateContent = {(newContent) => props.updateContent(newContent, currentReply.id, currentComment.id)}
                                                    addReply = {(content) => props.addReply(content, currentReply.user.username, currentComment.id)}
                                                    profileUrl = {props.profileUrl}
                                                />
                                            );  
                                        })
                                    }
                                </div>
                            }
                        </div>
                    )
                })
            }
        </div>
    );
}