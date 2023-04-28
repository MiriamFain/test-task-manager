import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { AiOutlineCheck } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';
import moment from 'moment';

import './taskItem.css';

const TaskItem = ({
    task,
    handleMarkImportant,
    handleMarkUrgent,
    onDelete,
    onComplete,
    handleEdit,
}) => {
    const { id, completed_at, description, created_at, important, urgent } =
        task;
    const isCompleted = Boolean(completed_at);

    const momentObj = moment(created_at);
    const formattedDate = momentObj.format('YYYY-MM-DD HH:mm:ss');

    const [newDesc, setNewDesc] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const onChange = event => {
        const value = event.target.value;
        setNewDesc(value);
    };

    const onSubmit = () => {
        handleEdit(id, newDesc);
        setIsEditing(false);
    };

    useEffect(() => {
        setNewDesc(description);
    }, [description]);

    const toggleEdit = () => {
        isEditing && handleEdit(id, newDesc);
        setIsEditing(prevState => !prevState);
    };

    return (
        <div className="task-item">
            <div className="item-left">
                <Button
                    className={`btn--icon ${isCompleted ? 'complete' : ''}`}
                    onClick={() => onComplete(id, !isCompleted)}
                >
                    <AiOutlineCheck />
                </Button>
                <div className="task-desc">
                    {isEditing ? (
                        <form onSubmit={onSubmit}>
                            <input
                                className="task-edit__input"
                                type="text"
                                autoFocus
                                value={newDesc}
                                onChange={onChange}
                            />
                        </form>
                    ) : (
                        <>
                            <span className="desc">{description}</span>
                            <span className="date">{formattedDate}</span>
                        </>
                    )}
                </div>
            </div>
            <div className="btn-list">
                {isEditing ? (
                    ''
                ) : (
                    <>
                        <div>
                            <button
                                className={`btn-important ${
                                    important ? 'active' : ''
                                }`}
                                onClick={() =>
                                    handleMarkImportant(id, !important)
                                }
                            >
                                Important
                            </button>
                            <button
                                className={`btn-urgent ${
                                    urgent ? 'active' : ''
                                }`}
                                onClick={() => handleMarkUrgent(id, !urgent)}
                            >
                                Urgent
                            </button>
                        </div>

                        <Button
                            className="btn--icon"
                            onClick={() => onDelete(id)}
                        >
                            <BsTrash />
                        </Button>
                    </>
                )}

                <Button
                    className={`btn--icon ${isEditing ? 'editing' : ''}`}
                    onClick={toggleEdit}
                >
                    <AiOutlineEdit />
                </Button>
            </div>
        </div>
    );
};

export default TaskItem;
