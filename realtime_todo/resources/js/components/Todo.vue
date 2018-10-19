
<template>
 <li class="todo" :class="{ completed: completed }">
     <div class="view">
         <input type="checkbox" v-model="completed" class="toggle">
         <label>{{todo.title}}</label>
         <button @click="removeTodo(todo)" class="destroy"></button>
     </div>
 </li>
</template>
<script>
export default {
  name: "Todo",
  props: ["todo"],
  computed: {
    completed() {
        return this.todo.completed !== 0;
    }
},
  methods: {
    removeTodo(todo) {
      this.$store.state.toRemove = todo;
      this.$store.dispatch("DELETE_TODO", todo);
    }
  }
};
</script>
