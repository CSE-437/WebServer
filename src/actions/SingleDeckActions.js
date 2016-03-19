import dispatcher from '../core/Dispatcher';
import $ from 'jquery';

class SingleDeckActions {
  constructor() {
    this.generateActions(
      'getDeckFail',
      'getDeckSuccess',
      'postTransactionsSuccess',
      'postTransactionsFail',
      'getTransactionsSuccess',
      'getTransactionsFail'
    );
  }

  getDeck(gid) {
    const self = this;
    $.get(`/api/decks/${gid}`)
    .done((data) => {
      self.getDeckSuccess(data);
    })
    .fail((data) => {
      self.getDeckFail(data);
    });
  }
}

export default dispatcher.createActions(SingleDeckActions);
