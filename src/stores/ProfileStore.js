import dispatcher from '../core/Dispatcher';
import ProfileActions from '../actions/ProfileActions';
import toastr from 'toastr';
// Remember that ever component gets it's own store
class ProfileStore {
  constructor() {
    // .log(ProfileActions);
    this.bindListeners({
      onSignUpSuccess: ProfileActions.signUpSuccess,
      onLogInSuccess: ProfileActions.logInSuccess,
      handleLogInFail: ProfileActions.logInFail,
      onGetMyDecksSuccess: ProfileActions.getMyDecksSuccess,
    });
    this.bindActions(ProfileActions);
    this.state = {
      decks: [],
      user: {},
      loggedIn: false,
    };
  }
  /* *********************
  DECK FUNCTIONS
  ***********************/
  onGetMyDecksSuccess(decks) {
    console.log('hello', decks);
    this.setState({ decks });
  }
  /* *********************
  LOGIN FUNCTIONS
  ***********************/
  onLogOutSuccess() {
    this.setState({
      user: {},
      decks: [],
      loggedIn: false,
    });
  }
  handleLogInFail(error){
    this.setState({
      loggedIn: false,
      decks: [],
      user: {},
    });
  }
  onSignUpSuccess(data) {
    console.log('here')
    var user = data.user || data;
    if(data.error){
      toastr.error(data.error);
      return;
    }
    this.setState({
      user,
      loggedIn: true,
    });
    //ProfileActions.getMyDecks(user.username);
  }
  onLogInSuccess(data) {
    console.log('here2')
    var user = data.user || data;
    if(data.error){
      toastr.error(data.error);
      return;
    }
    this.setState({
      user,
      loggedIn: true,
    });
    //ProfileActions.getMyDecks(user.username);
  }

  onPostTransactionsSuccess(data) {
    console.log("New Transactions", data);
    ProfileActions.updateUser({ username: this.state.user.username });
  }

  onUpdateUserSuccess(user) {
    var user = user || this.state.user
    this.setState({ user });
  }

}

export default dispatcher.createStore(ProfileStore);
