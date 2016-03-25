import dispatcher from '../core/Dispatcher';
import $ from 'jquery';

// Remember that this file runs on the client not the server
class ProfileActions {
  constructor() {
    // Each of these actiosn will become a function
    this.generateActions(
      'signUpSuccess',
      'signUpFail',
      'logInSuccess',
      'logInFail',
      'logOutSuccess',
      'logOutFail',
      'getMyDecksSuccess',
      'getMyDecksFail',
      'postTransactionsSuccess',
      'postTransactionsFail',
      'updateUserSuccess',
      'updateUserFail',
    );
  }

  signUp(info) {
    const self = this;
    $.post('/api/users/signup', info)
      .done((data) => {
        self.signUpSuccess(data);
      })
      .fail((data) => {
        self.signUpFail(data);
      });
  }

  logIn(info) {
    const self = this;
    $.post('/api/users/login', info)
      .done((data) => {
        self.logInSuccess(data);
      })
      .fail((data) => {
        self.logInFail(data);
        console.log('failed to login');
      });
  }

  logOut() {
    const self = this;
    $.post('/api/users/logout')
      .done((data) => {
        self.logOutSuccess(data);
      })
      .fail((data) => {
        self.logOutFail(data);
      });
  }

  getMyDecks(username) {
    const self = this;
    if (!username) {
      return self.getMyDecksFail({ error: "Not Logged In " });
    }
    $.get(`/api/decks?${username}`)
      .done((data) => {
        self.getMyDecksSuccess(data);
      })
      .fail((data) => {
        self.getMyDecksFail(data);
      });
  }

  postTransactions(username, transactions) {
    const t = { transactions };
    const self = this;
    $.post(`/api/users/${username}`, t)
    .done((data) => {
      self.postTransactionsSuccess(data)
    })
    .fail((data) => {
      self.postTransactionsFail(data)
    });
  }

  updateUser(options) {
    const self = this;
    $.get(`/api/users?${$.param(options, true)}`)
      .done((data) => {
        self.updateUserSuccess(data[0]);
      })
      .fail((data) => {
        self.updateUserFail(data);
      });
  }
}

export default dispatcher.createActions(ProfileActions);
