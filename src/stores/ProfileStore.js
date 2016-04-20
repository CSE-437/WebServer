import dispatcher from '../core/Dispatcher';
import ProfileActions from '../actions/ProfileActions';
import toastr from 'toastr';
import objectAssign from 'object-assign';
// Remember that ever component gets it's own store
class ProfileStore {
  constructor() {
    // .log(ProfileActions);
    this.bindListeners({
      onSignUpSuccess: ProfileActions.signUpSuccess,
      onLogInSuccess: ProfileActions.logInSuccess,
      handleLogInFail: ProfileActions.logInFail,
    });
    this.bindActions(ProfileActions);
    this.originalState = {
      decks: [],
      user: {},
      loggedIn: false,
      deckSubscriptions: [],
      transactions: [],
    };
    this.state = this.originalState;
  }
  /* *********************
  DECK FUNCTIONS
  ***********************/
  onGetMyDecksSuccess(decks) {
    console.log('Recieved New Decks', decks);
    this.setState({ decks });
  }

  onGetMyDecksFail(decks) {
    console.log(decks);
    console.log("Get Deck Error");
  }
  /* *********************
  transactions FUNCTIONS
  ***********************/
  onGetMyTransactionsSuccess(transactions) {
    console.log('New Transactions');
    this.setState({ transactions });
  }
  onGetMySubscriptionsSuccess(deckSubscriptions) {
    console.log('Got Subscriptions');
    this.setState({ deckSubscriptions });
  }
  /* *********************
  LOGIN FUNCTIONS
  ***********************/
  onLogOutSuccess() {
    console.log("not logged in anymore");
    this.setState(this.originalState);
    window.location.reload();
  }
  handleLogInFail(error){
    console.log("login fail", error);
    this.setState(this.originalState);
  }
  onSignUpSuccess(data) {
    console.log("sign up success", data);
    const user = data.user || data;
    this.setState(objectAssign(this.originalState, {
      user,
      loggedIn: true,
    }));
    console.log("logged in", this.state.loggedIn);
  }
  onLogInSuccess(data) {
    console.log("login success", data);
    const user = data.user || data;
    this.setState(objectAssign(this.originalState, {
      user,
      loggedIn: true,
    }));
    console.log("logged in", this.state.loggedIn);
  }

  onPostTransactionsSuccess() {
    ProfileActions.updateUser({ username: this.state.user.username });
  }

  onUpdateUserSuccess(u) {
    const user = u || this.state.user;
    this.setState({ user });
  }

}

export default dispatcher.createStore(ProfileStore);
