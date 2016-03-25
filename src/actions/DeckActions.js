import dispatcher from '../core/Dispatcher';
import toastr from 'toastr';
import $ from 'jquery'

class DeckActions {
  constructor() {
    this.generateActions(
      'reloadDecks',
      'getAllDecksFail',
      'getAllDecksSuccess',
      'uploadDeckSuccess',
      'uploadDeckFail',
      'getDeckSuccess',
      'getDeckFail',
      'postTransactionsSuccess',
      'postTransactionsFail',
      'getTransactionsSuccess',
      'getTransactionsFail'
    );
  }
  getAllDecks(options) {
    const self = this;
    const optionsString = (options && !($.isEmptyObject(options))) ? `?${$.param(options, true)}` : '';
    const queryString = `/api/decks${optionsString}`;
    self.reloadDecks();
    $.get(queryString)
    .done((data) => {
      self.getAllDecksSuccess(data);
    })
    .fail((data) => {
      self.getAllDecksFail(data);
    });
  }
  uploadDeck(deck){
    var self = this;
    $.post('/api/decks', decks)
    .done((data)=>{
      self.uploadDeckSuccess(data)
    })
    .fail((data)=>{
      self.uploadDeckFail(data)
    });
  }
  getDeck(did){
    var self = this;
    $.get(`/api/decks/${did}`, )
    .done((data)=>{
      self.getDeckSuccess(data)
    })
    .fail((data)=>{
      self.getDeckFail(data)
    });
  }
  postTransactions(gid, transactions) {
    const t = { transactions };
    const self = this;
    $.post(`/api/decks/${gid}`, t)
    .done((data)=>{
      self.postTransactionsSuccess(data)
    })
    .fail((data)=>{
      self.postTransactionsFail(data)
    });
  }
  getTransactions(did){
    var self = this;
    $.get(`/api/decks/${did}/transactions`)
    .done((data)=>{
      self.getTransactionsSuccess(data)
    })
    .fail((data)=>{
      self.getTransactionsFail(data)
    });
  }
}

export default dispatcher.createActions(DeckActions);
