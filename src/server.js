/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */


import 'babel-core/polyfill';
import path from 'path';
import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Router from './routes';
import Html from './components/Html';
import assets from './assets';
import { port } from './config';

import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
var ParseStore = require('connect-parse')(session);

import Parse from 'parse/node';
Parse.initialize(process.env.APP_ID || "AnkiHubParse");
Parse.serverURL = process.env.SERVER_URL || "https://ankihubparse2.herokuapp.com/parse";

var io = require('socket.io')(server);

const server = global.server = express();

import timeout from 'connect-timeout';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(morgan('dev'));//log every request to console
server.use(cookieParser()); //read cookies for authentication
server.use(bodyParser.json({limit: '50mb'}));
server.use(bodyParser.urlencoded({limit:'50mb',extended: true}));
//Connects to the sessions table of our database
server.use(session({
  secret:process.env.SESSION_SECRET || 'ankilove',
  store: new ParseStore({
    client: Parse
  }),
  resave: true,
  saveUninitialized: true
}));

server.use(express.static(path.join(__dirname, 'public')));


//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/api/content', require('./api/content'));
server.use('/api/users', require('./api/users/UserRouter'));
server.use('/api/decks', require('./api/decks/DeckRouter'));
server.use('/api/cards', require('./api/cards/CardRouter'));
server.use('/api/todo', require('./api/todo'));


//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------

server.get('*', async (req, res, next) => {
  try {
    let statusCode = 200;
    const data = { title: '', description: '', css: '', body: '', entry: assets.main.js };
    const css = [];
    const context = {
      insertCss: styles => css.push(styles._getCss()),
      onSetTitle: value => data.title = value,
      onSetMeta: (key, value) => data[key] = value,
      onPageNotFound: () => statusCode = 404,
    };

    await Router.dispatch({ path: req.path, query: req.query, context }, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(statusCode).send('<!doctype html>\n' + html);
  } catch (err) {
    next(err);
  }
});

//Instantiate Socket IO
var onlineUsers = 0;//TODO get rid of when done testing
io.sockets.on('connection', function(socket){
  onlineUsers++;

  io.sockets.emit('onlineUsers', {onlineUsers: onlineUsers});

  socket.on('disconnect', function(){
    onlineUsers--;
    io.sockets.emit('onlineUsers', {onlineUsers: onlineUsers});
  });
});

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});
