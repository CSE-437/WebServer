/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import s from './Navigation.scss';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';

@withStyles(s)
class Navigation extends Component {

  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    return (
      <div className={cx(s.root, this.props.className)} role="navigation">
        <a className={s.link} href="/profile" onClick={Link.handleClick}>profile</a>
        <span className={s.spacer}> | </span>
        <a className={cx(s.link, s.highlight)} href="/register" onClick={Link.handleClick}>Sign up</a>
      </div>
    );
  }

}

export default Navigation;
