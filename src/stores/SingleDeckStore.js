import dispatcher from '../core/Dispatcher';
import DeckActions from '../actions/DeckActions';
import toastr from 'toastr';
class SingleDeckStore {
  constructor() {
    this.bindActions(DeckActions);
    this.state = {};
    this.state.deck = {};
    this.state.transactions = [];
  }
  onGetDeckSuccess(data) {
    this.setState({ decksLoaded: true, deck: data });
  }
  onGetDeckFail(data) {
    toastr.error(data);
  }
}

export default dispatcher.createStore(SingleDeckStore);
