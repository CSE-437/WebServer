import dispatcher from '../core/Dispatcher';
import ProfileActions from '../actions/ProfileActions';

// Remember that ever component gets it's own store
class ProfileStore {
  constructor() {
    this.bindActions(ProfileActions);
    this.bindListeners({
      handleSignUp: ProfileActions.signUpSuccess,
      handleLogIn: ProfileActions.logInSuccess,
      loginFail: ProfileActions.loginFail,
    });
    this.decks = [];
    this.user = {};
  }
  handleSignUp(user) {
    this.user = user;
  }
}

export default dispatcher.createStore(ProfileStore);
