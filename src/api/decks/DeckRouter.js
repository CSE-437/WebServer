// Register todos with aws dynammodb.
// https://github.com/yortus/asyncawait
import { Router } from 'express';
import IsArray from '../../core/isArray';

const Parse = require('parse/node');
const randomstring = require('randomstring').generate;

import DeckObject, { DeckUtil } from './DeckModel';
import TransactionObject from '../transactions/TransactionModel';

const router = new Router();


// For the remaining routes require login.
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
  }else if(req.query && (req.query.username || req.query.owner) && req.query.sessionToken){
    req.username = req.query.owner || req.query.username;
    req.sessionToken = req.query.sessionToken;
    return next();
  }
  return res.status(400).json({ error: "Must send username and session Token" });
});

router.param('gid', async (req, res, next, gid) => {
  req.gid = gid;
  next();
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
    query.equalTo('owner', req.query.owner);
  }
  if (req.query.gid) {
    query.equalTo('gid', req.query.gid);
  }
  if (req.query.did) {
    query.equalTo('did', req.query.did);
  }
  if (req.query.since) {
    query.whereGreaterThan('createdAt', req.query.since);
  }
  const limit = (req.query.limit) ? parseInt(req.query.limit, 10) : 20;
  query.limit(limit);

  query.find({
    success: results => res.status(200).json(results.map((d) => d.toJSON())),
    error: (r, err) => res.status(400).json(err),
    sessionToken: req.sessionToken,
  });
});

router.get('/:gid', async (req, res) => {
  const query = DeckUtil.getDeckWithCardsQuery(req.gid);
  query.find({
    success: (results) => res.status(200).json(results.map((d) => d.toJSON())),
    error: (deck, error) => res.status(400).json({ error, deck: deck.toJSON(deck) }),
    sessionToken: req.sessionToken,
  });
});

router.get('/:gid/download', async (req, res) => {
  const query = DeckUtil.getDeckWithCardsQuery(req.gid);
  query.first({
    success: (result) => {
      if (!result) {
        res.status(403).json({ error: { message: 'Deck Not Found' } });
      } else {
        const csv = DeckUtil.toCSV(result);
        res.set({ 'Content-Disposition': `attachment; filename=${result.get('gid')}.txt`});
        res.send(csv);
      }
    },
    error: (deck, error) => res.status(400).json({ error, deck: deck.toJSON(deck) }),
    sessionToken: req.sessionToken,
  });
});

router.all('/:gid/transactions', async(req, res) => {
  const query = new Parse.Query(TransactionObject);
  if (req.query.indexGroup) {
    query.equalTo('indexGroup', req.query.indexGroup);
  }
  if (req.query.since) {
    query.whereGreaterThan('createdAt', req.query.since);
  }
  query.equalTo('on', req.gid);
  query.limit(req.query.limit || 20);
  query.descending('createdAt');
  query.find({
    success: (results) => res.status(200).json(results.map((deck) => deck.toJSON())),
    error: (r, error) => res.status(500).json(error),
    sessionToken: req.sessionToken,
  });
});

// Only for posting decks
router.post('/', async (req, res) => {
  const query = new Parse.Query(DeckObject);
  if (!req.body.gid && !req.body.did) {
    return res.status(400).json({ err: 'Must have a did or gid' });
  }
  var i = 0;
  let gid = '';
  let did = '';
  if (req.body.gid) {
    gid = req.body.gid;
    query.equalTo('gid', gid);
  } else if (req.body.did) {
    gid = [req.username, req.body.did].join(':');
    query.equalTo('gid', gid);
  }
  if (req.body.did) {
    did = req.body.did;
  } else {
    did = gid.split(':')[1];
  }
  query.find({
    success: (results) => {
      if (results.length > 0) {
        return res.status(400).json({ error: 'Deck already Exist' });
      }
      // TODO : Validate Decks
      const newDeck = DeckUtil.newDeck(req.username, gid, did, req.body);
      if (!newDeck) {
        return res.status(400).json({ error: 'Deck has malformed cards' })
      }
      newDeck.save(null, {
        success: (deck) => {
          console.log(`Post ${i++}`);
          const userQuery = new Parse.Query(Parse.User);
          userQuery.equalTo('username', req.username);
          userQuery.first({
            success: (user) => {
              if (!user) {
                return;
              }
              if (!user.get('decks')) {
                user.set('decks', []);
              }
              user.addUnique('decks', deck);
              user.save();
            },
          });
          console.log(`Post ${i++}`);

          // Set Ownership of Deck
          const t = new Parse.Object('Transaction');
          t.set('on', req.username);
          t.set('for', 'User');
          t.set('owner', req.username);
          t.set('indexGroup', randomstring(30));
          t.set('index', 0);
          t.set('query', 'aDECK');
          t.set('data', { gid });
          console.log(`Post ${i++}`);
          t.save(null, {
            success: () => res.status(200).json(deck.toJSON()),
            error: (d, err) => res.status(401).json({ error: err, deck: d.toJSON() }),
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


router.post('/:gid', async (req, res) => {
  const indexGroup = randomstring(30);
  const bodyTransactions = req.body.transactions || req.body;
  // console.log(bodyTransactions)
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
  console.log(transactions.map(t => t.toJSON()));
  Parse.Object.saveAll(transactions, {
    success: (list) => res.status(200).json(list),
    error: (t, error) => {return res.status(501).json(arguments);},
    sessionToken: req.sessionToken,
  });
  return null;
});


export default router;
