import taskService from "../../../services/task.service";

export default {
  state: {
    tasks: [],
  },

  //********************************************************************GETTERS*****************************************************************************************
  //********************************************************************************************************************************************************************

  getters: {
    allTasks: (state) => state.tasks,
    // unconfirmedDeposits: (state) => {
    //   return [
    //     state.tasks
    //       .filter((t) => t.CheckerID == 0)
    //       .filter((t) => t.TransactionCodeID == 1),
    //     [(state.tasks.title = "Contributions")],
    //   ];
    // },
  },

  //********************************************************************ACTIONS*****************************************************************************************
  //********************************************************************************************************************************************************************

  actions: {
    // tasks actions

    createTask({ commit }, data) {
      return taskService.create(data).then(
        (response) => {
          commit("newTask", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    getAllTasks({ commit }) {
      return taskService.getAll().then(
        (response) => {
          commit("setTasks", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    updateTask({ commit }, data) {
      return taskService.update(data.TaskID, data).then(
        (response) => {
          commit("updTask", data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    deleteTask({ commit }, data) {
      return taskService.delete(data.TaskID).then(
        (response) => {
          commit("dltTask", data);
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
    // Task EVENTS

    setTasks: (state, tasks) =>
      (state.tasks = tasks),
    newTask: (state, newTask) =>
      state.tasks.unshift(newTask.task),
    updTask: (state, updatedTask) => {
      const index = state.tasks.findIndex(
        (c) => c.TaskID === updatedTask.TaskID
      );
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask);
      }
    },
    dltTask: (state, Task) => {
      const index = state.tasks.findIndex(
        (c) => c.TaskID === Task.TaskID
      );
      if (index !== -1) {
        state.tasks.splice(index, 1);
      }
    },
  },
};
