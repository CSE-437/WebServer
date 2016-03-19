import dispatcher from '../core/Dispatcher';
import ProfileActions from '../actions/ProfileActions';
import toastr from 'toastr';
// Remember that ever component gets it's own store
class ProfileStore {
  constructor() {
    this.bindActions(ProfileActions);
    // .log(ProfileActions);
    this.bindListeners({
      handleSignUp: ProfileActions.signUpSuccess,
      handleLogIn: ProfileActions.logInSuccess,
      handleLogInFail: ProfileActions.logInFail,
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
}

export default dispatcher.createStore(ProfileStore);
