//Register todos with aws dynammodb.
//https://github.com/yortus/asyncawait
import Promise from 'bluebird';
import {Router} from 'express';
import Parse from 'parse/node';

import UserUtil from './UserUtil';
import TransactionObject from '../transactions/TransactionModel';

const router = new Router();

router.get('/', async (req,res,next) =>{
  //console.log("IN get all decks")
  var query = new Parse.Query(Parse.User);
  if(req.query.username){

    query.contains("username", req.query.username)
  }
  query.find({
    success: function(results){
      //console.log("Succssfully retrieved ", results);
      return res.status(200).send(results);
    },
    error: function(err){
      //console.log("Failed to get decks ", err);
      return res.status(400).send(err)
    },
    sessionToken: req.session.sessionToken
  });
});
router.post('/signup', async (req,res,next) => {
    var username = req.body.username;
    var password = req.body.password;

    if(username && password){
      var newUser = new Parse.User();
      newUser.set("username", username);
      newUser.set("password", password);
      newUser.set("subscriptions", []);
      newUser.signUp(null,{
        success: function(user){
          req.session.regenerate(function(err){
            req.session.sessionToken = user.toJSON().sessionToken;
            req.session.username = user.toJSON().username;
            res.status(200).send({err: null, user: user});
          });
        },
        error: function(user, error){
          res.status(400).send({err: error, user: user.toJSON()})
        },
        sessionToken: req.session.sessionToken
      });
    }else{
      return res.status(400).send({err: {msg: "Need username and password"}});
    }

});
router.get('/whoami', async (req,res,next)=>{
  res.status(200).send(req.session);
})
router.post('/login', async (req,res,next) => {
    var username = req.body.username;
    var password = req.body.password;
    if(username && password){
      Parse.User.logIn(username, password,{
        success: function(user){
          req.session.regenerate(function(err){
            req.session.sessionToken = user.toJSON().sessionToken;
            req.session.username = user.toJSON().username;
            req.user = user
            res.status(200).send({ error: null, user: user.toJSON() });
          });
        },
        error: function(user, error){
          res.status(400).send({  error, user: user.toJSON() });
        }
      });
    }else{
      return res.status(400).send({ error: {msg: "Need username and password" }});
    }

});

router.post('/logout', async (req,res,next) => {
  req.session.destroy();
  res.status(200).send("Logged out");
});
router.param('username', async (req, res, next, username) =>{
  req.username = username;
  next()
});

router.get('/:username', async (req, res, next) => {
  var query = new Parse.Query(Parse.User);
  query.equalTo("username", req.username);
  query.find({
    success: function(results){
      return res.status(200).send(results);
    },
    error: function(deck, error){
      return res.status(400).send({err: error, deck: deck});
    },
    sessionToken: req.session.sessionToken
  });
});
//Expects [transactions] TODO deal with Fork

//Expects [transactions] TODO deal with Fork
//TODO make stransaction method
router.post('/:username', async (req, res, next) =>{
  var current_id = req.username
  if (!req.body.isArray && !(req.body.length>0)){
    return res.status(400).send({err:"Must send array of transactions"})
  }
  var transactions = req.body.map(function(body){
    var t = new Parse.Object("Transaction");
    return TransactionUtil.fromRequestBody(t, body);
  });
  var parsedTransactions = []
  transactions.forEach(function(t){
    console.log("here5")
    t.set("on", current_id);
    t.save(null, {
      success: function(trans){
        //TODO maintain order

        parsedTransactions.push({transaction: trans, error: null});
        if(parsedTransactions.length == transactions.length){
          res.status(200).send(parsedTransactions)
        }
      },
      error: function(trans, error){

        parsedTransactions.push({transaction: trans, error: error});
        if(parsedTransactions.length == transactions.length){
          res.status(400).send(parsedTransactions)
        }
      },
      sessionToken: req.session.sessionToken
    });
  });
});
export default router;
