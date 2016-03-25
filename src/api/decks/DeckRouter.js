// Register todos with aws dynammodb.
// https://github.com/yortus/asyncawait
import { Router } from 'express';
import IsArray from '../../core/isArray';

const Parse = require('parse/node');
const randomstring = require('randomstring').generate;

import DeckObject from './DeckModel';
import TransactionObject from '../transactions/TransactionModel';

const router = new Router();

router.use(async (req, res, next) => {
  const user = new Parse.User();
  if (!req.session.sessionToken) {
    if(!req.body.sessionToken) {
      return res.status(400).json({error: "Need to send session token "});
    }
    await user.become(req.body.sessionToken);
  }
  req.user = user;
  next();
});

router.get('/', async (req, res) => {
  console.log('here 1');
  const query = new Parse.Query(DeckObject);
  console.log('here 2')
  if (req.query.keywords) {
    console.log(req.query.keywords);
    query.containsAll('keywords', [].concat(req.query.keywords));
    console.log('here 3')
    }
    console.log('here 4')
    if (req.query.name) {
    query.equalTo('name', req.query.name);
    console.log('here 5')
    }
    console.log('here 6')
    if (req.query.cids) {
    query.containsAll('cids', [].concat(req.query.cids));
    console.log('here 7')
    }
    console.log('here 8')
    if (req.query.owner) {
    query.equalTo('owner', req.query.user);
    console.log('here 9')
    }
    console.log('here 10')
    if (req.query.gid) {
    query.equalTo('gid', req.query.gid);
    console.log('here 11')
    }
    console.log('here 12')
    if (req.query.did) {
    query.equalTo('did', req.query.did);
    console.log('here 13')
    }
    const limit = (req.query.limit)? parseInt(req.query.limit) : 20;
  query.limit(limit);
  console.log(req.query);

  query.find({
    success: results => res.status(200).json(results.map((d) => d.toJSON())),
    error: (r, err) => res.status(400).json(err),
    sessionToken: req.session.sessionToken || req.body.sessionToken,
  });
});
// Only for posting decks
router.post('/', async (req, res) => {

  const query = new Parse.Query(DeckObject);
  if (!req.body.gid && !req.body.did) {
    return res.status(400).json({ err: 'Must have a did or gid' });
  }

  if (req.body.gid) {
    query.equalTo('gid', req.body.gid);
  } else if (req.body.did) {
    query.equalTo('gid', `${req.session.username  || req.user.get('username') }:${req.body.did}`);
  }
  query.find({
    success: (results) => {
      if (results[0]) {
        return res.status(400).json({ error: 'Deck already Exist' });
      }
      // TODO : Validate Decks
      const newDeck = new Parse.Object('Deck');
      Object.keys(req.body).forEach((key) => newDeck.set(key, req.body[key]));
      const gid = req.body.gid || `${req.session.username || req.user.get('username')}:${req.body.did}`;
      const did = gid.split(':')[1];
      newDeck.set('gid', gid);
      newDeck.set('did', did);
      newDeck.set('owner', req.session.username || req.user.get('username'));
      newDeck.save(null, {
        success: (deck) => {
          console.log('here2')
          const userQuery = new Parse.Query(Parse.User);
          userQuery.equalTo('username', req.session.username || req.user.get('username'));
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
          console.log("here");
          const t = new Parse.Object('Transaction');
          t.set('on', req.session.username || req.user.get('username'));
          t.set('for', 'User');
          t.set('owner', req.session.username || req.user.get('username'));
          t.set('indexGroup', randomstring(30));
          t.set('index', 0);
          t.set('query', 'aDECK');
          t.set('data', { gid });
          t.save(null, {
            success: () => res.status(200).json(deck.toJSON()),
            error: (deck, errr) => res.status(401).json({ error: err, deck: deck.toJSON() }),
            sessionToken: req.session.sessionToken || req.body.sessionToken,
          });
        },
        error: (deck, error) => res.status(402).json({ error, deck: deck.toJSON() }),
        sessionToken: req.session.sessionToken || req.body.sessionToken,
      });
      return null;
    },
    error: (deck, err) => res.status(403).json({ error: err, deck: {} }),
    sessionToken: req.session.sessionToken || req.body.sessionToken,
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
    sessionToken: req.session.sessionToken || req.body.sessionToken,
  });
});


router.post('/:gid', async (req, res) => {
  const indexGroup = randomstring(30);
  console.log("body", req.body);
  const bodyTransactions = req.body.transactions;
  console.log("transactions", IsArray(bodyTransactions));
  if (!IsArray(bodyTransactions) && !(bodyTransactions.length > 0)) {
    return res.status(400).json({ error: `Must send array of transactions: IsArray: ${bodyTransactions.isArray()}, length: bodyTransactions.length`} );
  }
  console.log("here2");
  const transactions = bodyTransactions.map((body, index) => {
    const t = new Parse.Object('Transaction');
    Object.keys(body).forEach((key) => t.set(key, body[key]));
    t.set('on', req.gid);
    t.set('for', 'Deck');
    t.set('owner', req.session.username || req.user.get('username'));
    t.set('indexGroup', indexGroup);
    t.set('index', index);
    return t;
  });

  Parse.Object.saveAll(transactions, {
    success: (list) => res.status(200).json(list),
    error: (t, error) => res.status(500).json(error),
    sessionToken: req.session.sessionToken || req.body[0].sessionToken,
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
    error: (r, error) => res.status(500).json(error),
    sessionToken: req.session.sessionToken || req.body.sessionToken,
  });
});

export default router;
