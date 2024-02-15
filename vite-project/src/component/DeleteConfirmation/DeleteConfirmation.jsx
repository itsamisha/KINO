import "./DeleteConfirmation.css";
const DeleteConfirmation = ({ text, onDelete, onCancel }) => {
  return (
    <div className="delete-confirmation-container">
      <div className="delete-confirmation">
        <div className="delete-confirmation-text">{text}</div>
        <div className="button-container">
          <button onClick={onDelete}>CONFIRM</button>
          <button onClick={onCancel}>CANCEL</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
