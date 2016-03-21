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
      onGetMyDecksSuccess: ProfileActions.getMyDecksSuccess,
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
  handleSignUp(data) {
    console.log('here')
    var user = data.user;
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
  handleLogIn(data) {
    console.log('here2')
    var user = data.user;
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
}

export default dispatcher.createStore(ProfileStore);
