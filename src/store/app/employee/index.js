import employeeService from "../../../services/employee.service";

export default {
  state: {
    employees: [],
  },

  //********************************************************************GETTERS*****************************************************************************************
  //********************************************************************************************************************************************************************

  getters: {
    allEmployees: (state) => state.employees,
    // unconfirmedDeposits: (state) => {
    //   return [
    //     state.employees
    //       .filter((t) => t.CheckerID == 0)
    //       .filter((t) => t.TransactionCodeID == 1),
    //     [(state.employees.title = "Contributions")],
    //   ];
    // },
  },

  //********************************************************************ACTIONS*****************************************************************************************
  //********************************************************************************************************************************************************************

  actions: {
    // employees actions

    createEmployee({ commit }, data) {
      return employeeService.create(data).then(
        (response) => {
          commit("newEmployee", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    getAllEmployees({ commit }) {
      return employeeService.getAll().then(
        (response) => {
          commit("setEmployees", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    updateEmployee({ commit }, data) {
      return employeeService.update(data.EmployeeID, data).then(
        (response) => {
          commit("updEmployee", data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    deleteEmployee({ commit }, data) {
      return employeeService.delete(data.EmployeeID).then(
        (response) => {
          commit("dltEmployee", data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
  },

  //********************************************************************MUTATIONS***************************************************************************************
  //********************************************************************************************************************************************************************
  mutations: {
    // Employee EVENTS

    setEmployees: (state, employees) =>
      (state.employees = employees),
    newEmployee: (state, newEmployee) =>
      state.employees.unshift(newEmployee.employee),
    updEmployee: (state, updatedEmployee) => {
      const index = state.employees.findIndex(
        (c) => c.EmployeeID === updatedEmployee.EmployeeID
      );
      if (index !== -1) {
        state.employees.splice(index, 1, updatedEmployee);
      }
    },
    dltEmployee: (state, Employee) => {
      const index = state.employees.findIndex(
        (c) => c.EmployeeID === Employee.EmployeeID
      );
      if (index !== -1) {
        state.employees.splice(index, 1);
      }
    },
  },
};
