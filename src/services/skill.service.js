import http from "../http-common";
import authHeader from "./auth-header";

class SkillDataService {
  create(data) {
    return http.post("/skills", data, { headers: authHeader() });
  }
  getAll() {
    return http.get("/skills", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/skills/${id}`, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/skills/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/skills/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/skills`, { headers: authHeader() });
  }
}

export default new SkillDataService();
