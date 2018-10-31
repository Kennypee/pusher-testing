
    let mutations = {
        ADD_TODO(state, todo) {
            state.todos.unshift(todo)
        },
        GET_TODOS(state, todos) {
            state.todos = todos
        },
        
   CACHE_REMOVED(state, todo) {
      state.toRemove = todo;
    },
        DELETE_TODO(state, todo) {
            state.todos.splice(state.todos.indexOf(todo), 1)
            state.toRemove = null;
        }
    }
    export default mutations
