import styles from "../styles/AddNewComment.module.css";
import { useState } from "react";

export default function AddNewComment(props) {
    const [newComment, setNewComment] = useState("");

    const addNew = function () {
        try {
            props.add(newComment);
            setNewComment("");
        } catch(err) {
            console.log(err);
        }
    }
    return (
        <div 
            className = {styles["add-new-comment-container"]}
        >
            <img src = {props.profileUrl} />
            <textarea 
                value = {newComment}
                onChange = {(e) => setNewComment(e.target.value)}
            />
            <button
                onClick = {addNew} 
                className = "blue-btn"
            >SEND</button>
        </div>
    );  
}