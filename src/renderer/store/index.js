import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

// import { createPersistedState, createSharedMutations } from 'vuex-electron'
import { createPersistedState } from 'vuex-electron'

import common from './modules/common'
import user from './modules/user'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage
})

export default new Vuex.Store({
  modules: {
    common,
    user
  },
  plugins: [
    vuexLocal.plugin,
    createPersistedState()
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
