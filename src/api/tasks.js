import axios from "axios";

const API_BASE_URL = "https://task-matrix.online/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

const getTasks = (page, perPage) => {
  return api.get(`/tasks?page=${page}&per_page=${perPage}`);
};

const getCompletedTasks = (page, perPage) => {
  return api.get(`/tasks/completed?page=${page}&per_page=${perPage}`);
};

const getTrashedTasks = (page, perPage) => {
  return api.get(`/tasks/trashed?page=${page}&per_page=${perPage}`);
};

const updateTask = (taskId, data) => {
  return api.put(`/tasks/${taskId}`, data);
};

const createTask = (description) => {
  const taskData = {
    description,
    created_at: new Date().toISOString(),
    important: false,
    urgent: false,
  };
  return api.post("/tasks", taskData);
};

const deleteTask = (taskId) => {
  return api.delete(`/tasks/${taskId}`);
};

const markTaskAsUrgent = (taskId) => {
  return api.post(`/tasks/${taskId}/urgent`);
};

const unmarkTaskAsUrgent = (taskId) => {
  return api.post(`/tasks/${taskId}/not-urgent`);
};

const markTaskAsImportant = (taskId) => {
  return api.post(`/tasks/${taskId}/important`);
};

const unmarkTaskAsImportant = (taskId) => {
  return api.post(`/tasks/${taskId}/not-important`);
};

const markTaskAsCompleted = (taskId) => {
  return api.post(`/tasks/${taskId}/complete`);
};

const unmarkTaskAsCompleted = (taskId) => {
  return api.post(`/tasks/${taskId}/not-complete`);
};

const restoreTask = (taskId) => {
  return api.post(`/tasks/${taskId}/restore`);
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
