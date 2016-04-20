import React, { Component, PropTypes } from 'react';

import Link from '../Link';
import { Input } from 'react-bootstrap';
class SearchBar extends Component {
  static PropTypes = {
    placeholder: React.PropTypes.string,
    onSearch: React.PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = { searchText: '' };
  }
  clear() {
    this.setState({ searchText: '' });
    if (this.props.onSearch){
      this.props.onSearch('');
    }
  }
  handleChange(event) {
    this.setState({ searchText: event.target.value });
  }
  search() {
    if (this.props.onSearch) {
      this.props.onSearch(this.state.searchText);
    }
  }
  render() {
    return (
      <div className="custom-search-input">
        <div className="input-group col-md-8">
        <Input type="text" placeholder={this.props.placeholder} value={this.state.searchText} onChange={this.handleChange.bind(this)}/>
        <span className="input-group-btn">
          <button onClick={this.clear.bind(this)} className="btn btn-default" type="button">
            <span className=" glyphicon glyphicon-remove"></span>
          </button>
          <button onClick={this.search.bind(this)} className="btn btn-info" type="button">
            <span className=" glyphicon glyphicon-search"></span>
          </button>
        </span>
        </div>
      </div>
    );
  }
}
export default SearchBar;
