import http from "../http-common";
import authHeader from "./auth-header";

class TaskDataService {
  create(data) {
    return http.post("/tasks", data, { headers: authHeader() });
  }
  getAll() {
    return http.get("/tasks", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/tasks/${id}`, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/tasks/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/tasks/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/tasks`, { headers: authHeader() });
  }

  createTaskActivity(data) {
    return http.post("/task_activities", data, { headers: authHeader() });
  }
  getAllTaskActivities() {
    return http.get("/task_activities", { headers: authHeader() });
  }

  getTaskActivity(id) {
    return http.get(`/task_activities/${id}`, { headers: authHeader() });
  }

  updateTaskActivity(id, data) {
    return http.put(`/task_activities/${id}`, data, { headers: authHeader() });
  }

  deleteTaskActivity(id) {
    return http.delete(`/task_activities/${id}`, { headers: authHeader() });
  }
}

export default new TaskDataService();
