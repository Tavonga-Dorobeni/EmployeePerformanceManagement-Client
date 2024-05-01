import http from "../http-common";
import authHeader from "./auth-header";

class MessageDataService {
  create(data) {
    return http.post("/messages", data, { headers: authHeader() });
  }
  getAll() {
    return http.get("/messages", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/messages/${id}`, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/messages/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/messages/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/messages`, { headers: authHeader() });
  }
}

export default new MessageDataService();
