export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    realName: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updaterealName (state, realName) {
      state.realName = realName
    }
  }
}
