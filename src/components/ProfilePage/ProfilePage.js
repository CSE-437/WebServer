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
    console.log('here');
    ProfileActions.getMyDecks(this.state.user.username);
    // As soon as it is poling for data get data
  }

  componentWillUnmount() {
    // remove event listener
    ProfileStore.unlisten(this.onChange);
  }

  // simply sets the state whenever the Deck store changes
  onChange(state) {
    console.log("New State");
    console.log("subscriptions", this.state.user.subscriptions);
    if(this.state.deckSubscriptions.length == 0 && (this.state.user.subscriptions.length > 0)){
      ProfileActions.getMySubscriptions(this.state.user.subscriptions);
    }
    this.setState(state);

  }

  render() {
    console.log(this.state)
    const page = (this.state.loggedIn)? (<div className="ProfilePage">
      <h3>Welcome {this.state.user.username}</h3>
      <span> Here are your subscriptions </span>
      <hr> <DeckList decks= {this.state.deckSubscriptions} /> </hr>
      <span>Here are your decks</span>
      <DeckList decks={this.state.decks}/>
    </div>) : (<h3>Please Login</h3>);
    return page;
  }
}

// <DeckForm onCommentSubmit={this.handleCommentSubmit} />

export default ProfilePage;
