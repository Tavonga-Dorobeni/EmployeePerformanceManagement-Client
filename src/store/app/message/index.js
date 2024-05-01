import messageService from "../../../services/message.service";

export default {
  state: {
    messages: [],
  },

  //********************************************************************GETTERS*****************************************************************************************
  //********************************************************************************************************************************************************************

  getters: {
    allMessages: (state) => state.messages,
    // unconfirmedDeposits: (state) => {
    //   return [
    //     state.messages
    //       .filter((t) => t.CheckerID == 0)
    //       .filter((t) => t.TransactionCodeID == 1),
    //     [(state.messages.title = "Contributions")],
    //   ];
    // },
  },

  //********************************************************************ACTIONS*****************************************************************************************
  //********************************************************************************************************************************************************************

  actions: {
    // messages actions

    createMessage({ commit }, data) {
      return messageService.create(data).then(
        (response) => {
          commit("newMessage", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    getAllMessages({ commit }) {
      return messageService.getAll().then(
        (response) => {
          commit("setMessages", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    updateMessage({ commit }, data) {
      return messageService.update(data.MessageID, data).then(
        (response) => {
          commit("updMessage", data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    deleteMessage({ commit }, data) {
      return messageService.delete(data.MessageID).then(
        (response) => {
          commit("dltMessage", data);
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
    // Message EVENTS

    setMessages: (state, messages) =>
      (state.messages = messages),
    newMessage: (state, newMessage) =>
      state.messages.push(newMessage.msg),
    updMessage: (state, updatedMessage) => {
      const index = state.messages.findIndex(
        (c) => c.MessageID === updatedMessage.MessageID
      );
      if (index !== -1) {
        state.messages.splice(index, 1, updatedMessage);
      }
    },
    dltMessage: (state, Message) => {
      const index = state.messages.findIndex(
        (c) => c.MessageID === Message.MessageID
      );
      if (index !== -1) {
        state.messages.splice(index, 1);
      }
    },
  },
};
