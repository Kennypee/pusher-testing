
import store from './store/index'

Vue.component('posts', require('./components/Posts'))
Vue.component('createPost', require('./components/CreatePost'))

const app = new Vue({
    el: '#app',
    store
});