import React, { Component } from 'react';

export default class EventEditor extends Component {
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
        <div id="bulk-editor">
          <a onClick={() => {
            const text = this.props.list.reduce((txt, event) => {
              let min = Math.floor(event.time / 60);
              let sec = event.time - (min * 60);
              return txt += '\n' + min + ':' + sec + ',' + event.text
            }, '// min:sec,description\nearly warning seconds=' + this.props.earlyWarning);
            this.setState({collapsed: false, list: text});
          }}>Edit Item List</a>
        </div>
      );
    } else {
      return (
        <div id="bulk-editor">
          <textarea
            rows="10"
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