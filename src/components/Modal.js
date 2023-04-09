import styles from "../styles/Modal.module.css";

export default function Modal(props) {
    return (
        <div className = {styles["modal-container"]}>
            <div className = {styles["popup"]}>
                {props.children}
            </div>
        </div>
    );
}