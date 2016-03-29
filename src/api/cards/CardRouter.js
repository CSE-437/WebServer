// Register todos with aws dynammodb.
// https://github.com/yortus/asyncawait
import { Router } from 'express';
import IsArray from '../../core/isArray';

const Parse = require('parse/node');
const randomstring = require('randomstring').generate;

import CardObject from './CardModel';
import TransactionObject from '../transactions/TransactionModel';

const router = new Router();



router.get('/', async (req, res) => {
  const query = new Parse.Query(CardObject);
  if (req.query.notes) {
    query.containsAll('notes', [].concat(req.query.notes));
    }
    if (req.query.name) {
    query.equalTo('name', req.query.name);
    }
    if (req.query.cid) {
    query.equalTo('cid', req.query.cid);
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

router.param('gid', async (req, res, next, gid) => {
  req.gid = gid;
  next();
});

router.get('/:gid', async (req, res) => {

  const query = new Parse.Query(CardObject);
  query.equalTo('gid', req.gid);
  query.find({
    success: (results) => res.status(200).json(results.map((d) => d.toJSON())),
    error: (Card, error) => res.status(400).json({ error, Card: Card.toJSON(Card) }),
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
    t.set('for', 'Card');
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
    success: (results) => res.status(200).json(results.map((Card) => Card.toJSON())),
    error: (r, error) => res.status(500).json(error),
    sessionToken: req.sessionToken,
  });
});

export default router;
