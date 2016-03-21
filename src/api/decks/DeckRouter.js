// Register todos with aws dynammodb.
// https://github.com/yortus/asyncawait
import { Router } from 'express';
const Parse = require('parse/node');
const randomstring = require('randomstring').generate;

import DeckObject from './DeckModel';
import TransactionObject from '../transactions/TransactionModel';

const router = new Router();

router.get('/', async (req, res) => {
  const query = new Parse.Query(DeckObject);
  if (req.query.keywords) {
    console.log(req.query.keywords);
    query.containsAll('keywords', [].concat(req.query.keywords));
  }
  if (req.query.name) {
    query.equalTo('name', req.query.name);
  }
  if (req.query.cids) {
    query.containsAll('cids', [].concat(req.query.cids));
  }
  if (req.query.owner) {
    query.equalTo('owner', req.query.user);
  }
  if (req.query.gid) {
    query.equalTo('gid', req.query.gid);
  }
  if (req.query.did) {
    query.equalTo('did', req.query.did);
  }
  query.limit(req.query.limit || 20);

  query.find({
    success: results => res.status(200).json(results.map((d) => d.toJSON())),
    error: err => res.status(400).json(err),
    sessionToken: req.session.sessionToken,
  });
});
// Only for posting decks
router.post('/', async (req, res) => {
  console.log("here")
  const query = new Parse.Query(DeckObject);
  if (!req.body.gid && !req.body.did) {
    return res.status(400).json({ err: 'Must have a did or gid' });
  }

  if (req.body.gid) {
    query.equalTo('gid', req.body.gid);
  } else if (req.body.did) {
    query.equalTo('gid', `${req.session.username}:${req.body.did}`);
  }
  query.find({
    success: (results) => {
      if (results[0]) {
        return res.status(400).json({ error: 'Deck already Exist' });
      }
      // TODO : Validate Decks
      const newDeck = new Parse.Object('Deck');
      Object.keys(req.body).forEach((key) => newDeck.set(key, req.body[key]));
      const gid = req.body.gid || `${req.session.username}:${req.body.did}`;
      const did = gid.split(':')[1];
      newDeck.set('gid', gid);
      newDeck.set('did', did);
      newDeck.set('owner', req.session.username);
      console.log('here1.5');
      newDeck.save(null, {
        success: (deck) => {
          console.log('here2')
          const userQuery = new Parse.Query(Parse.User);
          userQuery.equalTo('username', req.session.username);
          userQuery.find({
            success: (user) => {
              console.log('here3')
              if(!user.get('decks')){
                user.set('decks', []);
              }
              user.add('decks', deck);
              console.log('here4')
              user.save();
            },
          });
          console.log('here5')

          // Set Ownership of Deck
          const t = new Parse.Object('Transaction');
          t.set('on', req.session.username);
          t.set('for', 'User');
          t.set('owner', req.session.username);
          t.set('indexGroup', randomstring(30));
          t.set('index', 0);
          t.set('query', 'aDECK');
          t.set('data', { gid });
          t.save(null, {
            success: () => res.status(200).json(deck.toJSON()),
            error: (err) => res.status(400).json({ error: err, deck: deck.toJSON() }),
            sessionToken: req.session.sessionToken,
          });
        },
        error: (deck, error) => res.status(400).json({ error, deck: deck.toJSON() }),
        sessionToken: req.session.sessionToken,
      });
      return null;
    },
    error: (err) => res.status(500).json({ error: err, deck: {} }),
    sessionToken: req.session.sessionToken,
  });
  return null;
});
router.param('gid', async (req, res, next, gid) => {
  req.gid = gid;
  next();
});

router.get('/:gid', async (req, res) => {
  const query = new Parse.Query(DeckObject);
  query.equalTo('gid', req.gid);
  query.find({
    success: (results) => res.status(200).json(results.map((d) => d.toJSON())),
    error: (deck, error) => res.status(400).json({ error, deck: deck.toJSON(deck) }),
    sessionToken: req.session.sessionToken,
  });
});


router.post('/:gid', async (req, res) => {
  const indexGroup = randomstring(30);
  if (!req.body.isArray && !(req.body.length > 0)) {
    return res.status(400).json({ error: 'Must send array of transactions' });
  }
  const transactions = req.body.map((body, index) => {
    const t = new Parse.Object('Transaction');
    Object.keys(body).forEach((key) => t.set(key, body[key]));
    t.set('on', req.gid);
    t.set('for', 'Deck');
    t.set('owner', req.session.username);
    t.set('indexGroup', indexGroup);
    t.set('index', index);
    return t;
  });

  Parse.Object.saveAll(transactions, {
    success: (list) => res.status(200).json(list),
    error: (error) => res.status(500).json(error),
    sessionToken: req.session.sessionToken,
  });
  return null;
});

router.get('/:gid/transactions', async(req, res) => {
  const query = new Parse.Query(TransactionObject);
  if (req.query.indexGroup) {
    query.equalTo('indexGroup', req.query.indexGroup);
  }
  if (req.query.since) {
    query.whereGreaterThan('createdAt', req.query.since);
  }
  query.limit(req.query.limit || 20);
  query.descending('createdAt');

  query.find({
    success: (results) => res.status(200).json(results.map((deck) => deck.toJSON())),
    error: (error) => res.status(500).json(error),
    sessionToken: req.session.sessionToken,
  });
});

export default router;
