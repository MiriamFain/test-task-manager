import './notific.css';

const Notification = ({ text, onClick }) => {
    return (
        <div className="notification">
            <span className="notification__message">{text}</span>
            <button
                className="btn-notif notification__button"
                onClick={onClick}
            >
                UNDO
            </button>
        </div>
    );
};
export default Notification;
