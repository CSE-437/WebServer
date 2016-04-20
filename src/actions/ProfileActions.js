import dispatcher from '../core/Dispatcher';
import $ from 'jquery';
import DeckActions from './DeckActions';

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
      'getMySubscriptionsSuccess',
      'getMyTransactionsSuccess',
      'getMyTransactionsFail',
    );
  }

  signUp(info) {
    const self = this;
    console.log('posting signup info from profileactions');
    $.post('/api/users/signup', info)
    .done((data) => {
      self.signUpSuccess(data);
      self.logIn(info);
    })
    .fail((data) => {
      self.signUpFail(data);
    });
  }

  logIn(info) {
    const self = this;
    console.log('posting login info from profileactions');

    $.post('/api/users/login', info)
    .done((data) => {
      self.logInSuccess(data);
      DeckActions.setLoginState(true);
    })
    .fail((data) => {
      self.logInFail(data);
      console.log('failed to login');
    });
  }

  logOut() {
    const self = this;
    console.log('posting logout info from profileactions');

    $.post('/api/users/logout')
    .done((data) => {
      self.logOutSuccess(data);
    DeckActions.setLoginState(false);
    })
    .fail((data) => {
      self.logOutFail(data);
      console.log('failed to log out');
    });
  }

  getMyDecks(username) {
    const self = this;
    if (!username) {
      return self.getMyDecksFail({ error: "Not Logged In " });
    }
    $.get(`/api/decks?owner=${username}`)
    .done((data) => {
      self.getMyDecksSuccess(data);
    })
    .fail((data) => {
      self.getMyDecksFail(data);
    });
  }
  getMyTransactions(username) {
    const self = this;
    if (!username) {
      return self.getMyTransactionsFail({ error: 'Not Logged In' });
    }
    $.get(`/api/transactions?owner=${username}`)
    .done((data) => {
      self.getMyTransactionsSuccess(data);
    })
    .fail((data) => {
      self.getMyTransactionsFail(data);
    });
  }
  getMySubscriptions(subscriptions) {
    const self = this;
    let numDone = 0;
    const toReturn = [];
    const doneFunc = (data) => {
      numDone++;
      toReturn.push(data[0]);
      if (numDone >= subscriptions.length) {
        self.getMySubscriptionsSuccess(toReturn.filter((d) => !!d));
      }
    };
    const failFunc = () => {
      numDone++;
      if (numDone >= subscriptions.length) {
        self.getMySubscriptionsSuccess(toReturn.filter((d) => !!d));
      }
    };
    for (let i = 0; i < subscriptions.length; i++) {
      $.get(`/api/decks/${subscriptions[i]}`)
      .done(doneFunc)
      .fail(failFunc);
    }
  }
  postTransactions(username, transactions) {
    const t = { transactions };
    const self = this;
    $.post(`/api/users/${username}`, t)
    .done((data) => {
      self.postTransactionsSuccess(data);
    })
    .fail((data) => {
      self.postTransactionsFail(data);
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
