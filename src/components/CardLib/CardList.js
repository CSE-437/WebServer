import React, { Component, PropTypes } from 'react';

import { Grid, Row, Col } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class CardList extends Component {
  static PropTypes = {
    cards: PropTypes.array.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = { index: 0, direction: 'next' };
  }
  handleSelect(selectedIndex, selectedDirection) {
    this.setState({
      index: selectedIndex,
      direction: selectedDirection
    });
  }
  render() {
    const cList = this.props.cards.map((card)=>{
      return <ListGroupItem header={card}></ListGroupItem>
    });
    return (
      <div className="cardList">
      <Grid>
        <Row>
          <Col xs={4}>
            <ListGroup>
              {cList}
            </ListGroup>
          </Col>
          <Col xs={8}>hello</Col>
        </Row>
      </Grid>
      </div>
    );
  }
}
export default CardList;
