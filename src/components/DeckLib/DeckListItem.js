import React, { Component, PropTypes } from 'react';
import DeckActions from '../../actions/DeckActions';
import DeckStore from '../../stores/DeckStore';

import Link from '../Link';


import { Button, Glyphicon } from 'react-bootstrap';
import { Panel } from 'react-bootstrap';

import { Modal, Input } from 'react-bootstrap';

class DeckListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }
  render() {
    const deck = this.props.deck;
    const userUrl = `/users/${deck.owner}`;
    const deckUrl = `/decks/${deck.gid}`;
    const title = (
      <h4><Glyphicon glyph="align-justify"/>
      {' '}
      <a href={userUrl} onClick={Link.handleClick}>{deck.owner}</a>
      <span>/</span>
      <a href={deckUrl} onClick={Link.handleClick}>{deck.name}</a>
      </h4>
    );
    const subscribers = (deck.subscribers)? (
      <span>{deck.subscribers.length} Subscribers</span>
    ): <span>No Subscribers</span>;
    const cards = (deck.cids)? (
      <span>{deck.cids.length} Cards</span>
    ): <span>No Cards</span>;
    const keywords = (deck.keywords)? <span>Keywords: {
        deck.keywords.map((word) => <span><a>{word}</a>{', '}</span>)
    }</span>: <span>No Keywords</span>;
    return (
      <div>
      <Panel header={title}>
      <blockquote>Description: {deck.description}</blockquote>
      <Button onClick={this.open.bind(this)}>Get Link</Button><br />
      {keywords}<br />
      {subscribers}<br />
      {cards}
      </Panel>
      <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
      <Modal.Header closeButton>
      <Modal.Title>Paste this link into AnkiHub addon</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Input type="text" value={`${location.origin}/decks/${deck.gid}`} />
      </Modal.Body>
      </Modal>
      </div>
    );
  }
}
export default DeckListItem;
