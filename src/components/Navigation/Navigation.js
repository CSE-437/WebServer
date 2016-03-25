/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
const objectAssign = require('object-assign');
import ProfileStore from '../../stores/ProfileStore';
import ProfileActions from '../../actions/ProfileActions';
import s from './Navigation.scss';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';


import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Modal, Input, ButtonInput } from 'react-bootstrap';

import toastr from 'toastr';
@withStyles(s)
class Navigation extends Component {

  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = objectAssign(ProfileStore.getState(),
      { showModal: false, showRegisterModal: false});
    // need to use bind so that the this variable for onChange
    // refers to this DeckPage object not the function
    this.onChange = this.onChange.bind(this);
    this.openLogInModal = this.openLogInModal.bind(this);
    this.closeLogInModal = this.closeLogInModal.bind(this);
    this.openRegisterModal = this.openRegisterModal.bind(this);
    this.closeRegisterModal = this.closeRegisterModal.bind(this);
  }

  componentDidMount() {
    // makes the DeckStore call the onchange function whenever it cnanges.
    // This is why we had to use bind
    ProfileStore.listen(this.onChange);
    $.notify({
	title: "Welcome:",
	message: "This plugin has been provided to you by Robert McIntosh aka mouse0270"
});
    // As soon as it is poling for data get data
  }

  componentWillUnmount() {
    // remove event listener
    ProfileStore.unlisten(this.onChange);
  }

  openLogInModal() {
    this.setState({ showModal: true });
  }
  closeLogInModal() {
    this.setState({ showModal: false });
  }


  logIn(event) {
    event.preventDefault();
    const username = event.target[0].value;
    const password = event.target[1].value;
    ProfileActions.logIn({ username, password });
    this.closeLogInModal();
  }

  logOut() {
    ProfileActions.logOut();
  }


  openRegisterModal() {
    console.log('register');
    this.setState({showRegisterModal: true});
  }
  closeRegisterModal() {
    this.setState({showRegisterModal: false});
  }

  register(event) {
    event.preventDefault();
    const username = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    ProfileActions.signup({ username, email, password });
    this.closeRegisterModal();
  }

  onChange(state) {
    console.log("new state");
    this.setState(state)
  }

  render() {
    const LogInModalButton = (!this.state.loggedIn)?
      <NavItem onClick = {this.openLogInModal}>Log In</NavItem>:<NavItem onClick = {this.logOut}>Log Out</NavItem>

    const RegisterModalButton = <NavItem onClick = {this.openRegisterModal}>Register</NavItem>

    return (
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a className={s.link} href="/" onClick={Link.handleClick}>AnkiHub</a>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem>{this.props.children}</NavItem>
            <NavItem>{this.state.loggedIn}</NavItem>
          </Nav>
          <Nav pullRight>
            {LogInModalButton}
            {RegisterModalButton}
            <NavItem href="/profile" onClick={Link.handleClick}>Profile</NavItem>
            <NavItem href="/decks" onClick={Link.handleClick}>Decks</NavItem>
          </Nav>
        </Navbar.Collapse>

        <Modal show={this.state.showModal} onHide = { this.closeLogInModal }>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">LogIn to AnkiHub</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form onSubmit={ this.logIn.bind(this) }>
            <Input type="text" label="Username" placeholder="Username" ref="usernameField" value={this.state.username} />
            <Input type="password" label="Password" ref="passwordField" />
            <ButtonInput type="submit" value="Log In" />
          </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeLogInModal}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showRegisterModal} onHide = { this.closeRegisterModal }>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Register for AnkiHub</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form onSubmit={ this.register.bind(this) }>
            <Input type="text" label="Username" placeholder="Username" ref="usernameField" value={this.state.username} />
            <Input type="text" label="Email" placeholder="Email" ref="emailField" value={this.state.email} />
            <Input type="password" label="Password" ref="passwordField" />
            <ButtonInput type="submit" value="Register" />
          </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeRegisterModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Navbar>
    );
  }

}

export default Navigation;
