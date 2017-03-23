import React, { Component } from 'react';

export default class ItemEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      list: '',
    }
  }

  render() {
    if (this.state.collapsed) {
      return (
        <div className="item-editor">
          <a onClick={() => {
            const text = this.props.list.reduce((txt, item) => {
              let min = Math.floor(item.time / 60);
              let sec = item.time - (min * 60);
              return txt += '\n' + min + ':' + sec + ',' + item.text
            }, '// min:sec,description');
            this.setState({collapsed: false, list: text});
          }}>Edit Item List</a>
        </div>
      );
    } else {
      return (
        <div className="item-editor">
          <textarea
            rows="20"
            value={this.state.list}
            onChange={(event) => this.setState({list: event.target.value})}>
          </textarea>
          <a onClick={() => {
            this.setState({collapsed: true});
            this.props.update(this.state.list);
          }}>Save Edits</a>
        </div>
      );
    }
  }
}