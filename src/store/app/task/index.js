import taskService from "../../../services/task.service";

export default {
  state: {
    tasks: [],
    taskActivities: []
  },

  //********************************************************************GETTERS*****************************************************************************************
  //********************************************************************************************************************************************************************

  getters: {
    allTasks: (state) => state.tasks,
    allTaskActivities: (state) => state.taskActivities,
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


    createTaskActivity({ commit }, data) {
      return taskService.createTaskActivity(data).then(
        (response) => {
          commit("newTaskActivity", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    getAllTaskActivities({ commit }) {
      return taskService.getAllTaskActivities().then(
        (response) => {
          commit("setTaskActivities", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    updateTaskActivity({ commit }, data) {
      return taskService.updateTaskActivity(data.TaskActivityID, data).then(
        (response) => {
          commit("updTaskActivity", data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    deleteTaskActivity({ commit }, data) {
      return taskService.deleteTaskActivity(data.TaskActivityID).then(
        (response) => {
          commit("dltTaskActivity", data);
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

    setTaskActivities: (state, task_activities) =>
      (state.taskActivities = task_activities),
    newTaskActivity: (state, newActivity) =>
      state.taskActivities.unshift(newActivity.activity),
    updTaskActivity: (state, updatedActivity) => {
      const index = state.taskActivities.findIndex(
        (c) => c.TaskActivityID === updatedActivity.TaskActivityID
      );
      if (index !== -1) {
        state.taskActivities.splice(index, 1, updatedActivity);
      }
    },
    dltTaskActivity: (state, TaskActivity) => {
      const index = state.taskActivities.findIndex(
        (c) => c.TaskActivityID === TaskActivity.TaskActivityID
      );
      if (index !== -1) {
        state.taskActivities.splice(index, 1);
      }
    },
  },
};
