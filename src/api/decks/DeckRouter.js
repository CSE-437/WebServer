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
  if(req.session && req.session.username && req.session.sessionToken){
    req.username = req.session.username
    req.sessionToken = req.session.sessionToken;
    return next();
  }else if(IsArray(req.body)){
    const body = req.body[0];
    if(body && (body.username || body.owner ) && body.sessionToken){
      req.username = body.username || body.owner;
      req.sessionToken = body.sessionToken;
      return next();
    }else{
      return res.status(400).json({error: " Must send username and sessionToken with the first element of array" });
    }
  }else if(req.body && (req.body.username || req.body.owner) && req.body.sessionToken){
    req.username = req.body.owner || req.body.username;
    req.sessionToken = req.body.sessionToken;
    return next();
  }
  return res.status(400).json({ error: "Must send username and session Token" });
});

router.get('/', async (req, res) => {
  const query = new Parse.Query(DeckObject);
  if (req.query.keywords) {
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
    const limit = (req.query.limit)? parseInt(req.query.limit) : 20;
  query.limit(limit);

  query.find({
    success: results => res.status(200).json(results.map((d) => d.toJSON())),
    error: (r, err) => res.status(400).json(err),
    sessionToken: req.sessionToken,
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
    query.equalTo('gid', `${req.username }:${req.body.did}`);
  }
  query.find({
    success: (results) => {
      if (results[0]) {
        return res.status(400).json({ error: 'Deck already Exist' });
      }
      // TODO : Validate Decks
      const newDeck = new Parse.Object('Deck');
      Object.keys(req.body).forEach((key) => newDeck.set(key, req.body[key]));
      const gid = req.body.gid || `${req.username}:${req.body.did}`;
      const did = gid.split(':')[1];
      newDeck.set('gid', gid);
      newDeck.set('did', did);
      newDeck.set('owner', req.username);
      newDeck.save(null, {
        success: (deck) => {
          const userQuery = new Parse.Query(Parse.User);
          userQuery.equalTo('username', req.username);
          userQuery.find({
            success: (user) => {
              if(!user.get('decks')){
                user.set('decks', []);
              }
              user.addUnique('decks', deck);
              user.save();
            },
          });

          // Set Ownership of Deck
          const t = new Parse.Object('Transaction');
          t.set('on', req.username);
          t.set('for', 'User');
          t.set('owner', req.username);
          t.set('indexGroup', randomstring(30));
          t.set('index', 0);
          t.set('query', 'aDECK');
          t.set('data', { gid });
          t.save(null, {
            success: () => res.status(200).json(deck.toJSON()),
            error: (deck, errr) => res.status(401).json({ error: err, deck: deck.toJSON() }),
            sessionToken: req.sessionToken,
          });
        },
        error: (deck, error) => res.status(402).json({ error, deck: deck.toJSON() }),
        sessionToken: req.sessionToken,
      });
      return null;
    },
    error: (deck, err) => res.status(403).json({ error: err, deck: {} }),
    sessionToken: req.sessionToken,
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
    sessionToken: req.sessionToken,
  });
});


router.post('/:gid', async (req, res) => {
  const indexGroup = randomstring(30);
  const bodyTransactions = req.body.transactions || req.body;
  //console.log(bodyTransactions)
  if (!IsArray(bodyTransactions) && !(bodyTransactions.length > 0)) {
    return res.status(400).json({ error: `Must send array of transactions: IsArray: ${bodyTransactions.isArray()}, length: bodyTransactions.length`} );
  }
  const transactions = bodyTransactions.map((body, index) => {
    const t = new Parse.Object('Transaction');
    Object.keys(body).forEach((key) => t.set(key, body[key]));
    t.set('on', req.gid);
    t.set('for', 'Deck');
    t.set('owner', req.username);
    t.set('indexGroup', indexGroup);
    t.set('index', index);
    return t;
  });

  Parse.Object.saveAll(transactions, {
    success: (list) => res.status(200).json(list),
    error: (t, error) => {console.log(arguments); return res.status(500).json(error);},
    sessionToken: req.sessionToken,
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
    sessionToken: req.sessionToken,
  });
});

export default router;
