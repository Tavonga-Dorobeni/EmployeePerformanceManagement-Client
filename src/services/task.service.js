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
}

export default new TaskDataService();
