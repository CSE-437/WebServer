import dispatcher from '../core/Dispatcher'
import TodoActions from '../actions/TodoActions';

//Remember that ever component gets it's own store
class TodoStore{
  constructor(){
    this.bindActions(TodoActions)
    this.todos = []
  }
  //Notice the naming scheme. Alt expects hte functions to be named on
  //followed by Actions
  onGetTodosSuccess(data){
    this.todos = data
  }

  onGetTodosFail(err){
    //use toastr library to have popup error
    toastr.error(data.message)
  }
}

export default dispatcher.createStore(TodoStore);
