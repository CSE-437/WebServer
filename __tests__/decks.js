'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _randomstring = require('randomstring');

var _randomstring2 = _interopRequireDefault(_randomstring);

// const randomNumber = length => randomstring.generate({ length, charset: 'numeric' });
var randomString = function randomString(length) {
  return _randomstring2['default'].generate({ length: length });
};

function genRandomDeck(base, length) {
  return (0, _objectAssign2['default'])({
    name: randomString(length),
    keywords: (new Array(Math.floor(Math.random() * length + 1))).fill().map(function () {
      return randomString(length);
    }),
    description: randomString(length),
    did: randomString(length),
    isPublic: true
  }, base);
}

function genRandomCard(base, length) {
  return (0, _objectAssign2['default'])({
    cid: randomString(5),
    front: '{{Front}}',
    back: '{{FrontSide}}<hr id=answer>{{Back}}',
    keywords: (new Array(Math.floor(Math.random() * length + 1))).fill().map(function () {
      return randomString(length);
    }),
    tags: (new Array(Math.floor(Math.random() * length + 1))).fill().map(function () {
      return randomString(length);
    }),
    notes: [{ front: 'Test Front' }, { back: 'Test Back' }]
  }, base);
}

function genRandomArrayOfDecks(num, numcards, length) {
  var toReturn = [];
  for (var i = 0; i < num; i++) {
    var base = { newCards: [] };
    for (var j = 0; j <= numcards; j++) {
      base.newCards.push(genRandomCard({}, length));
    }
    toReturn.push(genRandomDeck(base, length));
  }
  return toReturn;
}

console.log(JSON.stringify(genRandomArrayOfDecks(1, 20, 5)[0]));
