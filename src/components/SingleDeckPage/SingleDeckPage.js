import React, { Component, PropTypes } from 'react';
import withStyles from '../../decorators/withStyles'; // Applies custmo style
import s from './SingleDeckPage.scss'; // Import custom styles
import ProfileStore from '../../stores/ProfileStore';
import ProfileActions from '../../actions/ProfileActions';
import SingleDeckStore from '../../stores/SingleDeckStore';
import SingleDeckActions from '../../actions/SingleDeckActions';
import Link from '../Link'
const objectAssign = require('object-assign');

import Loader from 'react-loader';
import { Glyphicon } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Tabs, Tab } from 'react-bootstrap';
import CardList from '../CardLib/CardList';
import SearchBar from '../misc/SearchBar';

let title = 'Decks';

@withStyles(s) // sets styles.
class SingleDeckPage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    deck: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = objectAssign( ProfileStore.getState(), SingleDeckStore.getState());
    this.state.deck = props.deck;
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  componentDidMount() {
    ProfileStore.listen(this.onChange);
    SingleDeckStore.listen(this.onChange);
    SingleDeckActions.getDeck(this.props.deck.gid);
  }

  componentWillUnmount() {
    ProfileStore.unlisten(this.onChange);
    SingleDeckStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSelect(key) {
    this.setState({ key });
  }

  render() {
    const deck = this.state.deck;
    const userUrl = `/users/${deck.owner}`;
    const deckUrl = `/decks/${deck.gid}`;
    const title = (
      <h2><Glyphicon glyph="align-justify" />
      {' '}
      <a href={userUrl} onClick={Link.handleClick}>{deck.owner}</a>
      <span>/</span>
      <a href={deckUrl} onClick={Link.handleClick}>{deck.name}</a>
      </h2>
    );
    const tab1Title = (
      <div><Glyphicon glyph="align-justify" />
      {' '}
      <span>Cards</span></div>
    );

    const tab2Title = (
      <div><Glyphicon glyph="align-justify" />
      {' '}
      <span>Issues</span></div>
    );

    const tab3Title = (
      <div><Glyphicon glyph="align-justify" />
      {' '}
      <span>Graphs</span></div>
    );
    return (
      <div className={s.root}>
        <div className={s.container}>
        <Tabs activeKey={this.state.key} onSelect={this.handleSelect.bind(this)}>
          <Tab eventKey={1} title={tab1Title}><CardList cards={deck.cids}/></Tab>
          <Tab eventKey={2} title={tab2Title}>Tab 2 content</Tab>
          <Tab eventKey={3} title={tab3Title}>Tab 3 content</Tab>
        </Tabs>
        </div>
      </div>
    );
  }

}

export default SingleDeckPage;
