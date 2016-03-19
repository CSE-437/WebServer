/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Router from 'react-routing/src/Router';
import fetch from './core/fetch';
import App from './components/App';
import ContentPage from './components/ContentPage';
import ContactPage from './components/ContactPage';

import DeckPage from './components/DeckPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';
import ProfilePage from './components/ProfilePage';
/*
Use a router from react-routing project.
https://github.com/kriasoft/react-routing
*/
const router = new Router(on => {
  /*
  on('path', function) calls the function when ever the passed path matches.
  */
  on('*', async (state, next) => {
    /*
    This actual blocks this function until the next one returns.
    Ex: If path was /contact, it would block here, wait for the
    function that passes the ContactPage to return, and resume.
    THIS WAITS FOR MULTIPLE CHILD COMPONENTS
    */
    const component = await next();
    // This syntacts checks to make sure the component isn't nil, and
    // Returns the <App context={state.context}>{component}</App>
    // Equivilent to return (component)? nil : <App context={state.context}>{component}</App>;
    return component && <App context={state.context}>{component}</App>;
  });
  // Show contact page
  on('/contact', async () => <ContactPage />);
  // show login page. TODO Implement
  on('/login', async () => <LoginPage />);
  // show register page.
  on('/register', async () => <RegisterPage />);
  // show register page.
  on('/decks', async () => <DeckPage />);
  // show todo page
  on('/Profile', async() => <ProfilePage />);
  //

  on('*', async (state) => {
    // Gets the api info for that content
    const response = await fetch(`/api/content?path=${state.path}`);
    const content = await response.json();
    // Returns the content page. This content page will be inside the app
    // due to the await next(); statement in the first on
    return content && <ContentPage {...content} />;
  });
  // Shows error pages. Custome 404 pages.
  on('error', (state, error) => state.statusCode === 404 ?
    <App context={state.context} error={error}><NotFoundPage /></App> :
    <App context={state.context} error={error}><ErrorPage /></App>
  );
});

// Whenever someoene calls require(routes.js) they will get this function
export default router;
