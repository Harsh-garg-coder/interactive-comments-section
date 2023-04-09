
import styles from "../styles/Comment.module.css";
import { useEffect, useState } from "react";
import AddNewComment from "./AddNewComment";
import plusIcon from "../images/icon-plus.svg";
import minusIcon from "../images/icon-minus.svg";
import deleteIcon from "../images/icon-delete.svg";
import editIcon from "../images/icon-edit.svg";
import replyIcon from "../images/icon-reply.svg";

export default function Comment(props) {
    const [isEditable, setIsEditable] = useState(false);
    const [newContent, setNewContent] = useState(props.commentData.content);
    const [showAddReplyBox, setShowAddReplyBox] = useState(false);

    const handleUpdate = () => {
        props.updateContent(newContent)
        setIsEditable(false);
    }

    const handleAddReply = function(replyContent) {
        props.addReply(replyContent);
        setShowAddReplyBox(false);
    }

    return (
        <>
            <div className = {styles["comment-container"]}>
                <div className = {styles["votes-container"]}>
                    <img 
                        src = {plusIcon}
                        alt = "upVote"
                        onClick = {props.upVote}
                    />
                    <span>{props.commentData.score}</span>  
                    <img 
                        src = {minusIcon}
                        alt = "downVote"
                        onClick = {props.downVote}
                    />
                </div>

                <div className = {styles["content-container"]}>
                    <div className = {styles["header"]}>
                        <img 
                            src = {props.commentData.user.image.webp}
                            className = {styles["user-images"]}
                        />
                        <span className = {styles["name"]}>
                            {props.commentData.user.username}
                            {
                                props.isCurrentUser &&
                                <span className = {styles["you-tag"]}>You</span>
                            }
                        </span>
                        
                        <span className = {styles["created-at"]}>{props.commentData.createdAt}</span>
                    </div>
                    <div className = {styles["content"]}>
                        {
                            isEditable ?
                            <div className = {styles["editable-container"]}>
                                <textarea
                                    // value = {props.commentData.content}
                                    className = {styles["content-textarea"]}
                                    value = {newContent}
                                    onChange = {(e) => setNewContent(e.target.value)}
                                    >
                                    {/* @{props.commentData.replyingTo}{props.commentData.content} */}
                                </textarea>
                                <button 
                                    className = {[styles["update-btn"],"blue-btn"].join(" ")}
                                    onClick = {handleUpdate}
                                >
                                    Update
                                </button>
                            </div>
                            :
                            <>
                                {props.commentData.replyingTo && 
                                <span className = {styles["reply-tag"]}>@
                                    {props.commentData.replyingTo}
                                </span>}
                                {props.commentData.content}
                            </>
                        }
                        {/* <textarea> */}
                        {/* {
                            props.commentData.replyingTo && 
                            <span className = {styles["reply-tag"]}>@
                                {props.commentData.replyingTo}
                            </span>
                        }
                        {props.commentData.content} */}
                        {/* </textarea> */}
                    </div>
                </div>

                <div className = {styles["controls-container"]}>
                    {   
                        
                        props.isCurrentUser ? 
                        <div className = {styles["delete-edit-container"]}>
                            <div 
                                className = {styles["delete-btn"]}
                                onClick = {props.handleDelete}
                            >
                                <img src = {deleteIcon}/>
                                Delete
                            </div>
                            <div 
                                className = {styles["edit-btn"]}
                                onClick = {() => setIsEditable((prev) => !prev)}
                            >
                                <img src = {editIcon}/>
                                Edit
                            </div>
                        </div> 
                        : 
                        <div 
                            className = {styles["reply-btn"]}
                            onClick = {() => setShowAddReplyBox((prev) => !prev)}
                        >
                            <img src = {replyIcon}/>
                            Reply
                        </div>
                    }
                </div>
            </div>
            {
                showAddReplyBox && 
                <AddNewComment 
                    profileUrl = {props.profileUrl}
                    add = {handleAddReply}
                />
            }
        </>
    );
}