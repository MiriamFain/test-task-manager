import { useState } from "react";
import "./App.css";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Header from "./components/Header";
import Notification from "./components/PopUp";
import { BeatLoader } from "react-spinners";
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
} from "./api/tasks";
import { useMutation, useQuery, useQueryClient } from "react-query";

function App() {
  const [message, setMessage] = useState("");
  const [isTaskProcessing, setIsTaskProcessing] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTasks = async (page) => {
    const {
      data: { data, total, per_page },
    } = await getTasks(page, 15);
    const totalPages = Math.ceil(Number(total) / Number(per_page));
    setTotalPages(totalPages);
    return data;
  };

  const {
    isLoading,
    error,
    data: tasks,
  } = useQuery(
    ["tasks", page],
    async () => {
      let allTasks = [];
      for (let i = 1; i <= page; i += 1) {
        const data = await fetchTasks(i);
        allTasks = [...allTasks, ...data];
      }
      return allTasks;
    },
    {
      keepPreviousData: true,
    }
  );

  const removeTask = async (taskId) => {
    return new Promise((resolve) => {
      setIsTaskProcessing(true);
      setMessage("Task deleted");
      setTimerId(
        setTimeout(async () => {
          await deleteTask(taskId);
          setMessage("");
          setIsTaskProcessing(false);
          resolve();
        }, 4000)
      );
    });
  };

  const markComplete = async ({ taskId, isComplete }) => {
    return new Promise((resolve) => {
      setIsTaskProcessing(true);
      setMessage("Task completed");
      setTimerId(
        setTimeout(
          async () => {
            if (isComplete) {
              await markTaskAsCompleted(taskId);
            } else {
              await unmarkTaskAsCompleted(taskId);
            }
            setMessage("");
            setIsTaskProcessing(false);
            resolve();
          },
          isComplete ? 4000 : 0
        )
      );
    });
  };

  const client = useQueryClient();

  const addTaskMutation = useMutation((task) => createTask(task), {
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["tasks", page] });
    },
  });

  const markCompleteMutation = useMutation(
    async ({ taskId, isComplete }) =>
      await markComplete({ taskId, isComplete }),
    {
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["tasks", page] });
      },
    }
  );

  const deleteTaskMutation = useMutation(
    async (taskId) => await removeTask(taskId),
    {
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["tasks", page] });
      },
    }
  );

  const editTaskMutation = useMutation(
    async ({ taskId, description }) =>
      await updateTask(taskId, { description }),
    {
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["tasks", page] });
      },
    }
  );

  const markUrgentMutation = useMutation(
    async ({ taskId, isUrgent }) => {
      isUrgent
        ? await markTaskAsUrgent(taskId)
        : await unmarkTaskAsUrgent(taskId);
    },
    {
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["tasks", page] });
      },
    }
  );

  const markImportantMutation = useMutation(
    async ({ taskId, isImportant }) => {
      isImportant
        ? await markTaskAsImportant(taskId)
        : await unmarkTaskAsImportant(taskId);
    },
    {
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["tasks", page] });
      },
    }
  );

  const clearTimeoutId = () => {
    if (!isTaskProcessing) return;
    clearTimeout(timerId);
    setMessage("");
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      {isLoading && (
        <div className="loader-container">
          <BeatLoader color="#aaa" size={40} />
        </div>
      )}
      {error && <div>Error: {error.message}</div>}
      {!isLoading && !error && (
        <>
          <Header />
          <main>
            <div className="g-row">
              {message && (
                <Notification text={message} onClick={clearTimeoutId} />
              )}

              <TaskForm onAddTask={addTaskMutation.mutate} />
              <TaskList
                tasks={tasks}
                handleMarkImportant={markImportantMutation.mutate}
                handleMarkUrgent={markUrgentMutation.mutate}
                handleDelete={deleteTaskMutation.mutate}
                handleMarkComplete={markCompleteMutation.mutate}
                handleEdit={editTaskMutation.mutate}
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
      )}
    </>
  );
}

export default App;
