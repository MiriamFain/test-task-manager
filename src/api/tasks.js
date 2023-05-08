import axios from "axios";

const API_BASE_URL = "https://task-matrix.online/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

const getTasks = async (page, perPage) => {
  return await api.get(`/tasks?page=${page}&per_page=${perPage}`);
};

const getCompletedTasks = async (page, perPage) => {
  return await api.get(`/tasks/completed?page=${page}&per_page=${perPage}`);
};

const getTrashedTasks = async (page, perPage) => {
  return await api.get(`/tasks/trashed?page=${page}&per_page=${perPage}`);
};

const updateTask = async (taskId, data) => {
  return await api.put(`/tasks/${taskId}`, data);
};

const createTask = async (description) => {
  const taskData = {
    description,
    created_at: new Date().toISOString(),
    important: false,
    urgent: false,
  };
  return await api.post("/tasks", taskData);
};

const deleteTask = async (taskId) => {
  return await api.delete(`/tasks/${taskId}`);
};

const markTaskAsUrgent = async (taskId) => {
  return await api.post(`/tasks/${taskId}/urgent`);
};

const unmarkTaskAsUrgent = async (taskId) => {
  return await api.post(`/tasks/${taskId}/not-urgent`);
};

const markTaskAsImportant = async (taskId) => {
  return await api.post(`/tasks/${taskId}/important`);
};

const unmarkTaskAsImportant = async (taskId) => {
  return await api.post(`/tasks/${taskId}/not-important`);
};

const markTaskAsCompleted = async (taskId) => {
  return await api.post(`/tasks/${taskId}/complete`);
};

const unmarkTaskAsCompleted = async (taskId) => {
  return await api.post(`/tasks/${taskId}/not-complete`);
};

const restoreTask = async (taskId) => {
  return await api.post(`/tasks/${taskId}/restore`);
};

export {
  getTasks,
  getCompletedTasks,
  getTrashedTasks,
  updateTask,
  createTask,
  deleteTask,
  markTaskAsUrgent,
  unmarkTaskAsUrgent,
  markTaskAsImportant,
  unmarkTaskAsImportant,
  markTaskAsCompleted,
  unmarkTaskAsCompleted,
  restoreTask,
};
