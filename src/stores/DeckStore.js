import dispatcher from '../core/Dispatcher';
import DeckActions from '../actions/DeckActions';
import toastr from 'toastr';
class DeckStore {
  constructor() {
    this.bindActions(DeckActions);
    this.state = {};
    this.state.decks = [];
    this.state.workingDeck = null;
    this.state.transactions = [];
    this.state.decksLoaded = false;
    this.state.loggedIn = false;
  }
  
  /* *********************
  LOGIN FUNCTIONS
  ***********************/
  setLoginState(bool) {
    this.setState({loggedIn: bool});
  }

  onPostTransactionsSuccess() {
    ProfileActions.updateUser({ username: this.state.user.username });
  }

  onUpdateUserSuccess(u) {
    const user = u || this.state.user;
    this.setState({ user });
  }

  onReloadDecks() {
    this.setState({ decksLoaded: false });
  }
  onGetAllDecksSuccess(data) {
    // console.log(" Got Decks ");
    this.setState({ decksLoaded: true, decks: data });
  }
  onGetAllDecksFail(data) {
    toastr.error(data);
  }
  onUploadDeckSuccess(data) {
    if (this.workingDeck) {
      this.state.decks.push(this.workingDeck);
    }
    this.state.workingDeck = data;
  }
  onUploadDeckFail(data) {
    toastr.error(data);
  }
  onGetDeckSuccess(data) {
    if (this.workingDeck) {
      this.state.decks.push(this.workingDeck);
    }
    this.state.workingDeck = data;
  }
  onGetDeckFail(data) {
    toastr.error(data);
  }
  onPostTransactionsSuccess(data) {
    this.state.transactions.concat(data);
  }
  onPostTransactionsFail(data) {
    toastr.error(data);
  }
  onGetTransactionsSuccess(data) {
    this.state.transactions.concat(data);
  }
  onGetTransactionsFail(error) {
    toastr.error(error);
  }
}

export default dispatcher.createStore(DeckStore);
