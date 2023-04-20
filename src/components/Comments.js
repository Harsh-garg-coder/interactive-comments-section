import styles from "../styles/Comments.module.css";
import Comment from "./Comment";

export default function Comments(props) {
    const handleDelete = function (id, parentId) {
        props.setIdOfCommentToDelete(id);
        props.setParentIdOfCommentToDelete(parentId)
        props.showDeleteModal();
    }

    return (
        <div className = {styles["comments-container"]}>
            {
                props.rootComments.map((currentComment) => {
                     return (
                        <div 
                            key = {currentComment.id}
                        >
                            <Comment 
                                isCurrentUser = {props.currentUser.username === currentComment.user.username}
                                commentData = {currentComment}
                                upVote = {() => props.changeVote(1, currentComment.id, props.parentCommentId)}
                                downVote = {() => props.changeVote(-1, currentComment.id, props.parentCommentId)}
                                handleDelete = {() => handleDelete(currentComment.id, props.parentCommentId)}
                                updateContent = {(newContent) => props.updateContent(newContent, currentComment.id, props.parentCommentId)}
                                addReply = {(content) => props.addReply(content, currentComment.user.username, currentComment.id)}
                                profileUrl = {props.currentUser.image.webp}
                            />
                            {
                                props.comments[currentComment.id] &&
                                <div className = {styles["replies-container"]}>
                                    <Comments
                                        {...props}
                                        rootComments = {props.comments[currentComment.id]}
                                        parentCommentId = {currentComment.id}
                                    />
                                </div>

                            }
                            </div>
                    )
                })
            }
        </div>
    );
}