import siteService from "../../../services/site.service";

export default {
  state: {
    sites: [],
  },

  //********************************************************************GETTERS*****************************************************************************************
  //********************************************************************************************************************************************************************

  getters: {
    allSites: (state) => state.sites,
    // unconfirmedDeposits: (state) => {
    //   return [
    //     state.sites
    //       .filter((t) => t.CheckerID == 0)
    //       .filter((t) => t.TransactionCodeID == 1),
    //     [(state.sites.title = "Contributions")],
    //   ];
    // },
  },

  //********************************************************************ACTIONS*****************************************************************************************
  //********************************************************************************************************************************************************************

  actions: {
    // sites actions

    createSite({ commit }, data) {
      return siteService.create(data).then(
        (response) => {
          commit("newSite", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    getAllSites({ commit }) {
      return siteService.getAll().then(
        (response) => {
          commit("setSites", response.data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    updateSite({ commit }, data) {
      return siteService.update(data.SiteID, data).then(
        (response) => {
          commit("updSite", data);
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    deleteSite({ commit }, data) {
      return siteService.delete(data.SiteID).then(
        (response) => {
          commit("dltSite", data);
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
    // Site EVENTS

    setSites: (state, sites) =>
      (state.sites = sites),
    newSite: (state, newSite) =>
      state.sites.unshift(newSite.site),
    updSite: (state, updatedSite) => {
      const index = state.sites.findIndex(
        (c) => c.SiteID === updatedSite.SiteID
      );
      if (index !== -1) {
        state.sites.splice(index, 1, updatedSite);
      }
    },
    dltSite: (state, Site) => {
      const index = state.sites.findIndex(
        (c) => c.SiteID === Site.SiteID
      );
      if (index !== -1) {
        state.sites.splice(index, 1);
      }
    },
  },
};
