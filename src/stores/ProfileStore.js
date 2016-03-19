import dispatcher from '../core/Dispatcher';
import ProfileActions from '../actions/ProfileActions';
import toastr from 'toastr';
// Remember that ever component gets it's own store
class ProfileStore {
  constructor() {
    this.bindActions(ProfileActions);
    this.bindListeners({
      handleSignUp: ProfileActions.signUpSuccess,
      handleLogIn: ProfileActions.logInSuccess,
      loginFail: ProfileActions.logInFail,
    });
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
    this.setState({ decks });
  }
  /* *********************
  LOGIN FUNCTIONS
  ***********************/
  onLogOutSuccess() {
    this.setState({
      user: {},
      loggedIn: false,
    });
  }
  handleSignUp(user) {
    this.setState({
      user,
      loggedIn: true,
    });
    ProfileActions.getMyDecks(user.username);
  }
  handleLogIn(user) {
    this.setState({
      user,
      loggedIn: true,
    });
    ProfileActions.getMyDecks(user.username);
  }
  loginFail(err) {
    toastr.error(err);
  }
}

export default dispatcher.createStore(ProfileStore);
