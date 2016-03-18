// Register todos with aws dynammodb.
// https://github.com/yortus/asyncawait
import { Router } from 'express';
const Parse = require('parse/node');
const randomstring = require('randomstring').generate;

import CardObject from './CardModel';
import TransactionObject from '../transactions/TransactionModel';

const router = new Router();

router.get('/', async (req, res) => {
  const query = new Parse.Query(CardObject);
  if (req.query.keywords) {
    query.containsAll('keywords', req.query.keywords);
  }
  if (req.query.owner) {
    query.equalTo('owner', req.query.owner);
  }
  if (req.query.cid) {
    query.equalTo('cid', req.query.cid);
  }
  if (req.query.did) {
    query.equalTo('did', req.query.did);
  }
  if (req.query.gid) {
    query.equalTo('gid', req.query.gid);
  }
  if (req.query.notes) {
    query.containsAll('notes', req.query.notes);
  }
  if (req.query.tags) {
    query.containsAll('cid', req.query.tags);
  }
  query.limit(req.query.limit || 20);

  query.find({
    success: results => res.status(200).json(results.map((d) => d.toJSON())),
    error: err => res.status(400).json(err),
    sessionToken: req.session.sessionToken,
  });
});

router.param('gid', async (req, res, next, gid) => {
  req.gid = gid;
  next();
});

router.get('/:gid', async (req, res) => {
  const query = new Parse.Query(CardObject);
  query.equalTo('gid', req.gid);
  query.find({
    success: (results) => res.status(200).json(results.map((d) => d.toJSON())),
    error: (card, error) => res.status(400).json({ error, card: card.toJSON() }),
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
    t.set('for', 'Card');
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
