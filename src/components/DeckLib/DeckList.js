import React, { Component, PropTypes } from 'react';

import {ListGroup} from 'react-bootstrap';
import DeckListItem from './DeckListItem';

class DeckList extends Component{
  constructor(props){
    super(props);
  }



render(){
  let deckNodes = this.props.decks.map((deck, index) => {
      return (
        <DeckListItem key={index} deck={deck} />
      );
  });
  return (
    <div className="deckList">
      {deckNodes}
    </div>
  );
}
}
export default DeckList;
