
import Parse from 'parse/node';
import { CardUtil } from '../cards/CardModel';

const Deck = Parse.Object.extend('Deck', {}, {});
export default Deck;

export const DeckUtil = {
  newDeck: (username, gid, did, deck) => {
    const newDeck = new Parse.Object('Deck');
    var i = 0;
    newDeck.set('owner', username);
    newDeck.set('gid', gid);
    newDeck.set('did', did);
    newDeck.set('keywords', []);

    newDeck.set('description', deck.description);
    newDeck.set('name', deck.name);
    newDeck.set('keywords', []);
    for (let word of deck.keywords) {
      newDeck.addUnique('keywords', word);
    }
    newDeck.set('isPublic', deck.isPublic || true);
    newDeck.set('children', []);
    if (deck.children){

      for (let child of deck.children) {
        newDeck.addUnique('children', child);
      }
    }

    if (deck.newCards) {
      if (deck.newCards.every(CardUtil.ValidateCard)) {
        newDeck.set('newCards', deck.newCards);
      } else {
        return null;
      }
    }

    return newDeck;
  },
  getDeckWithCardsQuery: (gid) => {
    const query = new Parse.Query(Deck);
    query.equalTo('gid', gid);
    query.include('cards.pointer');
    query.include('cards.pointer.notes');
    query.include('cards.pointer.tags');
    query.include('cards.pointer.CardType');
    query.include('cards.pointer.CardType.FrontSide');
    query.include('cards.pointer.CardType.BackSide');
    query.include('cards.pointer.owner');
    query.include('cards.pointer.cid');
    query.include('cards.pointer.did');
    query.include('cards.pointer.gid');
    return query;
  },
};
