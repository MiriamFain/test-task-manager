import { useState, useEffect, useCallback } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Header from './components/Header';
import Notification from './components/PopUp';
import { BeatLoader } from 'react-spinners';
import {
    getTasks,
    createTask,
    deleteTask,
    updateTask,
    markTaskAsImportant,
    unmarkTaskAsImportant,
    markTaskAsUrgent,
    unmarkTaskAsUrgent,
    markTaskAsCompleted,
    unmarkTaskAsCompleted,
} from './api/tasks';

function App() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState('');
    const [timerId, setTimerId] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const {
                data: { data, total, per_page },
            } = await getTasks(page, 15);
            const totalPages = Math.ceil(Number(total) / Number(per_page));
            setTasks(prevTasks => {
                //checks if last item in tasks array === last item of array that we got to prevent of adding the same data
                const shouldUpdate =
                    prevTasks.length === 0 ||
                    (data.length > 0 &&
                        data[data.length - 1]?.id !==
                            prevTasks[prevTasks.length - 1]?.id);

                return shouldUpdate ? [...prevTasks, ...data] : prevTasks;
            });

            setTotalPages(totalPages);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks, page]);

    if (loading) {
        return (
            <div className="loader-container">
                <BeatLoader color="#aaa" size={40} />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleMarkImportant = async (taskId, isImportant) => {
        if (isImportant) {
            await markTaskAsImportant(taskId);
        } else {
            await unmarkTaskAsImportant(taskId);
        }
        const updTasks = tasks.map(task =>
            task.id === taskId ? { ...task, important: isImportant } : task,
        );
        setTasks(updTasks);

        fetchTasks();
    };

    const handleMarkUrgent = async (taskId, isUrgent) => {
        if (isUrgent) {
            await markTaskAsUrgent(taskId);
        } else {
            await unmarkTaskAsUrgent(taskId);
        }
        const updTasks = tasks.map(task =>
            task.id === taskId ? { ...task, urgent: isUrgent } : task,
        );
        setTasks(updTasks);

        fetchTasks();
    };

    const handleMarkComplete = async (taskId, isComplete) => {
        if (isComplete) {
            setMessage('Task completed');
            await markTaskAsCompleted(taskId);
        } else {
            await unmarkTaskAsCompleted(taskId);
        }

        setTimerId(
            setTimeout(
                async () => {
                    const completed_at = isComplete ? Date.now() : null;
                    const updTasks = tasks.map(task =>
                        task.id === taskId ? { ...task, completed_at } : task,
                    );
                    setTasks(updTasks);
                    setMessage('');
                    fetchTasks();
                },
                isComplete ? 4000 : 0,
            ),
        );
    };

    const handleDelete = async taskId => {
        setMessage('Task deleted');

        setTimerId(
            setTimeout(async () => {
                await deleteTask(taskId);
                const updTasks = tasks.filter(({ id }) => id !== taskId);
                setTasks(updTasks);
                setMessage('');
                fetchTasks();
            }, 4000),
        );
    };

    const clearTimeoutId = () => {
        clearTimeout(timerId);
        setMessage('');
    };

    const handleEdit = async (taskId, description) => {
        await updateTask(taskId, { description });
        const updTasks = tasks.map(task =>
            task.id === taskId ? { ...task, description } : task,
        );
        setTasks(updTasks);
    };

    const handleAddTask = async description => {
        const taskData = {
            description,
            created_at: new Date().toISOString(),
            important: false,
            urgent: false,
        };
        const { data } = await createTask(taskData);
        setTasks(prevTasks => {
            const updatedTasks = [data, ...prevTasks];
            return updatedTasks;
        });
    };
    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    return (
        <>
            <Header />
            <main>
                <div className="g-row">
                    {message && (
                        <Notification text={message} onClick={clearTimeoutId} />
                    )}

                    <TaskForm onAddTask={handleAddTask} />
                    <TaskList
                        tasks={tasks}
                        handleMarkImportant={handleMarkImportant}
                        handleMarkUrgent={handleMarkUrgent}
                        handleDelete={handleDelete}
                        handleMarkComplete={handleMarkComplete}
                        handleEdit={handleEdit}
                        page={page}
                    />
                    {page < totalPages && (
                        <button className="load_more" onClick={handleLoadMore}>
                            Load More
                        </button>
                    )}
                </div>
            </main>
        </>
    );
}

export default App;
