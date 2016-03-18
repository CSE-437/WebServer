import dispatcher from '../core/Dispatcher';
import DeckActions from '../actions/DeckActions';
import toastr from 'toastr';
class DeckStore {
  constructor() {
    this.bindListeners({
      onGetAllDecksSuccess: DeckActions.getAllDecksSuccess,
      onGetAllDecksFail: DeckActions.getAllDecksFail,
      onUploadDeckSuccess: DeckActions.uploadDeckSuccess,
      onUploadDeckFail: DeckActions.uploadDeckFail,
      onGetDeckSuccess: DeckActions.getDeckSuccess,
      onGetDeckFail: DeckActions.getDeckFail,
      onPostTransactionsSuccess: DeckActions.postTransactionsSuccess,
      onPostTransactionsFail: DeckActions.postTransactionsFail,
      onGetTransactionsSuccess: DeckActions.getTransactionsSuccess,
      onGetTransactionsFail: DeckActions.getTransactionsFail,
    });
    this.decks = [];
    this.workingDeck = null;
    this.transactions = [];
  }
  onGetAllDecksSuccess(data) {
    this.decks = data;
  }
  onGetAllDecksFail(data) {
    toastr.error(data);
  }
  onUploadDeckSuccess(data) {
    if (this.workingDeck) {
      this.decks.push(this.workingDeck);
    }
    this.workingDeck = data;
  }
  onUploadDeckFail(data) {
    toastr.error(data);
  }
  onGetDeckSuccess(data) {
    if (this.workingDeck) {
      this.decks.push(this.workingDeck);
    }
    this.workingDeck = data;
  }
  onGetDeckFail(data) {
    toastr.error(data);
  }
  onPostTransactionsSuccess(data) {
    this.transactions.concat(data);
  }
  onPostTransactionsFail(data) {
    toastr.error(data);
  }
  onGetTransactionsSuccess(data) {
    this.transactions.concat(data);
  }
  onGetTransactionsFail(error) {
    toastr.error(error);
  }
}

export default dispatcher.createStore(DeckStore);
