import skillService from "../../../services/skill.service";

export default {
  state: {
    skills: [],
  },

  //********************************************************************GETTERS*****************************************************************************************
  //********************************************************************************************************************************************************************

  getters: {
    allSkills: (state) => state.skills,
    // unconfirmedDeposits: (state) => {
    //   return [
    //     state.skills
    //       .filter((t) => t.CheckerID == 0)
    //       .filter((t) => t.TransactionCodeID == 1),
    //     [(state.skills.title = "Contributions")],
    //   ];
    // },
  },

  //********************************************************************ACTIONS*****************************************************************************************
  //********************************************************************************************************************************************************************

  actions: {
    // skills actions

    createSkill({ commit }, data) {
      return skillService.create(data).then(
        (response) => {
          commit("newSkill", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    getAllSkills({ commit }) {
      return skillService.getAll().then(
        (response) => {
          commit("setSkills", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    updateSkill({ commit }, data) {
      return skillService.update(data.SkillID, data).then(
        (response) => {
          commit("updSkill", data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    deleteSkill({ commit }, data) {
      return skillService.delete(data.SkillID).then(
        (response) => {
          commit("dltSkill", data);
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
    // Skill EVENTS

    setSkills: (state, skills) =>
      (state.skills = skills),
    newSkill: (state, newSkill) =>
      state.skills.unshift(newSkill.skill),
    updSkill: (state, updatedSkill) => {
      const index = state.skills.findIndex(
        (c) => c.SkillID === updatedSkill.SkillID
      );
      if (index !== -1) {
        state.skills.splice(index, 1, updatedSkill);
      }
    },
    dltSkill: (state, Skill) => {
      const index = state.skills.findIndex(
        (c) => c.SkillID === Skill.SkillID
      );
      if (index !== -1) {
        state.skills.splice(index, 1);
      }
    },
  },
};
