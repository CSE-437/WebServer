
import Parse from 'parse/node';

const Card = Parse.Object.extend('Card', {}, {});
export default Card;
export const CardType = Parse.Object.extend('CardType', {}, {});
export const CardTemplate = Parse.Object.extend('CardTemplate', {}, {});
export const NoteType = Parse.Object.extend('NoteType', {}, {});
export const CardUtil = {
  ValidateCard: (card) => {
    // Used for referencing a card
    if (card.is) {
      return true;
    }

    return (card.front && card.back && card.notes);
  },
};
