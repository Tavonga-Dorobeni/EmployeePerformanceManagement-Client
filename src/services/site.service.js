import http from "../http-common";
import authHeader from "./auth-header";

class SiteDataService {
  create(data) {
    return http.post("/sites", data, { headers: authHeader() });
  }
  getAll() {
    return http.get("/sites", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/sites/${id}`, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/sites/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/sites/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/sites`, { headers: authHeader() });
  }
}

export default new SiteDataService();
