import dispatcher from '../core/Dispatcher';
import TodoActions from '../actions/TodoActions';

// Remember that ever component gets it's own store
class TodoStore {
  constructor() {
    this.bindActions(TodoActions);
    this.todos = [];
  }
  // Notice the naming scheme. Alt expects hte functions to be named on
  // followed by Actions
  onGetTodosSuccess(data) {
    this.todos = data;
  }
}

export default dispatcher.createStore(TodoStore);
