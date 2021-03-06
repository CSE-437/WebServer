/**
* React Starter Kit (https://www.reactstarterkit.com/)
*
* Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE.txt file in the root directory of this source tree.
*/

import React, { Component, PropTypes } from 'react';
import s from './ProfilePage.scss';
import withStyles from '../../decorators/withStyles';
import ProfileStore from '../../stores/ProfileStore';
import ProfileActions from '../../actions/ProfileActions';
import Link from '../Link';

// Boostrap components

import { Button } from 'react-bootstrap';
import { Input } from 'react-bootstrap';
import { ButtonToolbar} from 'react-bootstrap';

import DeckList from '../DeckLib/DeckList';

// tutorial14.js
@withStyles(s) // sets styles
class ProfilePage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  // Constroctor for class.
  // REMEBER props and state are two different things.
  // databinding uses props.
  constructor(props) {
    super(props);
    this.state = ProfileStore.getState();
    // need to use bind so that the this variable for onChange
    // refers to this DeckPage object not the function
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    this.context.onSetTitle("Profile Page");
  }

  // Alwasy call
  componentDidMount() {
    // makes the DeckStore call the onchange function whenever it cnanges.
    // This is why we had to use bind
    ProfileStore.listen(this.onChange);
    this.startPolling();
    // As soon as it is poling for data get data
  }

  componentWillUnmount() {
    // remove event listener
    ProfileStore.unlisten(this.onChange);
  }

  // simply sets the state whenever the Deck store changes
  onChange(state) {
    console.log("Profile Page State");
    console.log(this.state);
    this.setState(state);
  }

  startPolling() {
    const self = this;
    setTimeout(() => {
      ProfileActions.getMyDecks(self.state.user.username);
      ProfileActions.getMyTransactions(self.state.user.username);
      if (this.state.user.subscriptions) {
        ProfileActions.getMySubscriptions(self.state.user.subscriptions);
      }
    }, 1000);
  }

  render() {
    console.log(this.state.deckSubscriptions);
    const subscriptions = this.state.deckSubscriptions || [];
    const page = (this.state.loggedIn)? (<div className="ProfilePage">
      <h3>Welcome {this.state.user.username}</h3>
      <h2> Here are your subscriptions </h2>
      <br /> <DeckList decks= {subscriptions} />
      <hr />
      <h2>Here are your decks</h2>
      <DeckList decks={this.state.decks} />
    </div>) : (<h3>Please Login</h3>);
    return page;
  }
}

// <DeckForm onCommentSubmit={this.handleCommentSubmit} />

export default ProfilePage;
