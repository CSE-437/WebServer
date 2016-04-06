import React, { Component, PropTypes } from 'react';

import { ListGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import DeckListItem from './DeckListItem';

class DeckList extends Component{
  constructor(props){
    super(props);
  }

render(){
  const decks = this.props.decks || [];
  const actions = this.props.actions || [];
  const deckNodes = decks.map((deck, index) => {
    const bActions = (!actions) ? <span>No Actions</span> :  actions.map((action, i) => {
      return (<Button key={index} onClick={ actions[i].action.bind(null, index, deck) }>{ actions[i].name }</Button>)
    });


      return (
        <DeckListItem key={index} deck={deck} >
          { bActions }
        </DeckListItem>
      );
  });
  return (
    <div className="deckList">
      {deckNodes}
    </div>
  );
}
}

class DeckListAction{
  // action is a function that takes the index of the deck and the deck
  // ex action(index, deck)
  constructor(name, action) {
    this.name = name;
    this.action = action;
  }
}

export default DeckList;
export { DeckListAction };
