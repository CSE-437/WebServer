/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import s from './Footer.scss';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import classNames from 'classnames';
@withStyles(s)
class Footer extends Component {

  render() {
    const cx = classNames([s.root, 'footer', 'navbar-fixed-bottom']);
    console.log(cx)
    return (
      <footer className={cx}>
        sexy footer
      </footer>
    );
  }

}

export default Footer;
