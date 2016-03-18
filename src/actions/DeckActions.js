import dispatcher from '../core/Dispatcher';
import {toQueryString} from '../core/misc';

import $ from 'jquery'

class DeckActions{
  constructor(){
    this.generateActions(
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
    )
  }
  getAllDecks(options){
    var self = this
    var optionsString = options? '?'+toQueryString(options):'';
    $.get('/api/decks'+optionsString)
    .done((data)=>{
      self.getAllDecksSuccess(data)
    })
    .fail((data)=>{
      self.getAllDecksFail(data)
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
  postTransactions(did, transactions){
    var self = this;
    $.post(`/api/decks/${did}`, transactions)
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
