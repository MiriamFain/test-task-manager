import TaskItem from '../TaskItem';
import './taskList.css';

const TaskList = ({
    tasks,
    handleMarkImportant,
    handleMarkUrgent,
    handleDelete,
    handleMarkComplete,
    handleEdit,
}) => {
    if (!Array.isArray(tasks) || tasks.length === 0) {
        return <p>There are no tasks...</p>;
    }

    return (
        <div className="g-col task-list">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    handleMarkImportant={handleMarkImportant}
                    handleMarkUrgent={handleMarkUrgent}
                    onDelete={handleDelete}
                    handleEdit={handleEdit}
                    onComplete={handleMarkComplete}
                />
            ))}
        </div>
    );
};

export default TaskList;
