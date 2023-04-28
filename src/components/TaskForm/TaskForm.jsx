import React, { useState } from 'react';
import Button from '../Button';
import { AiOutlinePlus } from 'react-icons/ai';
import './taskForm.css';

const TaskForm = ({ onAddTask }) => {
    const [description, setDescription] = useState('');

    const handleSubmit = async event => {
        event.preventDefault();
        if (description) {
            onAddTask(description);
            setDescription('');
        }
    };

    const handleDescriptionChange = event => {
        setDescription(event.target.value);
    };

    // const handleKeyUp = event => {
    //     if (event.key === 'Enter') {
    //         handleSubmit(event);
    //     }
    // };

    return (
        <div className="g-col">
            <form className="task-form" onSubmit={handleSubmit} noValidate>
                <input
                    autoComplete="off"
                    autoFocus
                    className="task-form__input"
                    maxLength="64"
                    onChange={handleDescriptionChange}
                    // onKeyUp={handleKeyUp}
                    placeholder="What needs to be done?"
                    type="text"
                    value={description}
                />
                <Button
                    type="submit"
                    className="task-form__submit-btn btn--icon"
                >
                    <AiOutlinePlus />
                </Button>
            </form>
        </div>
    );
};

export default TaskForm;
