import { Router } from 'express';
import IsArray from '../../core/isArray';


const Parse = require('parse/node');

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
  }
  return res.status(400).json({ error: "Must send username and session Token" });
});

router.param('objectId', async (req, res, next, objectId) => {
  req.objectId = objectId;
  next();
});


router.get('/', async (req, res) => {
  const query = new Parse.Query(TransactionObject);
  if (req.query.indexGroup) {
    query.equalTo('indexGroup', req.query.indexGroup);
    if (req.query.index) {
      query.equalTo('index', req.query.index);
    }
  }
  if (req.query.owner) {
    query.equalTo('owner', req.query.owner);
  }
  const limit = (req.query.limit) ? parseInt(req.query.limit, 10) : 20;
  query.limit(limit);

  query.find({
    success: results => res.status(200).json(results.map((d) => d.toJSON())),
    error: (r, err) => res.status(400).json(err),
    sessionToken: req.sessionToken,
  });
});

router.all('/:objectId', async (req, res) => {
  const query = new Parse.Query(TransactionObject);
  query.get(req.objectId, {
    success: result => res.status(200).json(result.toJSON()),
    error: (r, err) => res.status(400).json(err),
    sessionToken: req.sessionToken,
  });
});


router.post('/:objectId', async (req, res) => {
  const query = new Parse.Query(TransactionObject);
  if (!req.body.actions || !IsArray(req.body.actions)){
    res.status(400).json({ error: 'Need to send an array of actions' });
  }
  query.get(req.objectId, {
    success: t => {
      const actions = req.body.actions;
      for (const action of actions) {
        switch (action) {
          case 'ACKNOWLEDGED':
            t.set('acknowledged', true);
            break;
          default:
            break;
        }
      }
      t.set('done', true); // Retroactively make transactions done.
      t.save(null, {
        success: (result) => res.status(200).json(result.toJSON()),
        error: (r, err) => res.status(400).json(err),
        sessionToken: req.sessionToken,
      });
    },
    error: (r, err) => res.status(400).json(err),
    sessionToken: req.sessionToken,
  });
});

export default router;
