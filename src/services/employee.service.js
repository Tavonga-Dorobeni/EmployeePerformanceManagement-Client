import http from "../http-common";
import authHeader from "./auth-header";

class EmployeeDataService {
  create(data) {
    return http.post("/employees", data, { headers: authHeader() });
  }
  getAll() {
    return http.get("/employees", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/employees/${id}`, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/employees/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/employees/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/employees`, { headers: authHeader() });
  }
}

export default new EmployeeDataService();
