import React, { Component, PropTypes } from 'react';
import withStyles from '../../decorators/withStyles'; // Applies custmo style
import s from './DeckPage.scss'; // Import custom styles
import DeckStore from '../../stores/DeckStore';
import DeckActions from '../../actions/DeckActions';
import Link from '../Link'
const objectAssign = require('object-assign');

import Loader from 'react-loader';
import { Button } from 'react-bootstrap';
import { Grid, Row, Col } from 'react-bootstrap';
import DeckList from '../DeckLib/DeckList';
import SearchBar from '../misc/SearchBar';

const title = 'Find Decks';

@withStyles(s) // sets styles.
class DeckPage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = objectAssign(DeckStore.getState(), { queryOptions: {} });

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  componentDidMount() {
    DeckStore.listen(this.onChange);
    DeckActions.getAllDecks();
  }

  componentWillUnmount() {
    DeckStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  modifySearch(key, value) {
    const query = this.state.queryOptions;
    if (key === 'keywords') {
      // Always return an array
      const keywords = value.match(/\w+/g);
      console.log(keywords);
      query.keywords = keywords;
    } else {
      query[key] = value;
    }
    if (!value) {
      delete query[key];
    }
    this.setState({ queryOptions: query });
    DeckActions.getAllDecks(query);
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Grid>
            <Row>
              <Col xs={6}>
              <h2>Deck Search</h2><Loader loaded={this.state.decksLoaded} />
              <br />
              <h4>Search By Name:</h4>
              <SearchBar placeholder="name"
                onSearch={this.modifySearch.bind(this,'name')} />
              <br />

              <h4>Search By Owner:</h4>
              <SearchBar placeholder="username"
                onSearch={this.modifySearch.bind(this,'owner')} />
              <br />

              <h4>Search By KeyWords:</h4>
              <SearchBar placeholder="keyword1, keyword2"
                onSearch={this.modifySearch.bind(this,'keywords')} />
              <br />

              <h4>Search By Global ID:</h4>
              <SearchBar placeholder="username:did"
                onSearch={this.modifySearch.bind(this,'gid')} />
              <br />

              <h4>Search By Deck ID:</h4>
              <SearchBar placeholder="did"
                onSearch={this.modifySearch.bind(this,'did')} />
              <br />

              <h4>Search By Card ID:</h4>
              <SearchBar placeholder="username:did:cid"
                onSearch={this.modifySearch.bind(this,'cid')} />
              <br />

              </Col>
              <Col xs={6}><DeckList decks={this.state.decks} /></Col>
            </Row>
          </Grid>


          <br />

        </div>
      </div>
    );
  }

}

export default DeckPage;
