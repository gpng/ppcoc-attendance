import React, { Component } from 'react';
import Fuse from 'fuse.js';

import { getAllMembers, postAttendance } from '../actions';

class Index extends Component {
  constructor(props) {
    super(props);
    this.fuse = null;
    this.state = {
      results: [],
      text: '',
      loading: true,
    };
    // bindings
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getMembers();
  }

  async getMembers() {
    const [err, members] = await getAllMembers();
    if (!err) {
      const options = {
        shouldSort: true,
        includeScore: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ['name'],
      };
      this.fuse = new Fuse(members, options);
      this.setState({ loading: false });
    } else {
      console.log(err);
    }
  }

  handleChange(ev) {
    const text = ev.target.value;
    this.setState({ text: ev.target.value, results: this.fuse.search(text) });
  }

  async handleClick(id) {
    const [err] = await postAttendance(id);
    if (!err) {
      this.setState({
        text: '',
        results: [],
      });
    } else {
      console.log(err);
    }
  }

  render() {
    const { text, loading, results } = this.state;

    return (
      <div>
        <h1>Welcome to PPCOC attendance page</h1>
        {loading ? (
          <div>loading...</div>
        ) : (
          <div>
            <input value={text} onChange={this.handleChange} />
            <div className="autocomplete">
              {results.map(x => (
                <button
                  type="button"
                  className="result"
                  key={x.item.id}
                  onClick={() => this.handleClick(x.item.id)}
                >
                  {x.item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <style jsx>
          {`
            .member {
              border: 1px solid black;
              padding: 16px;
              border-radius: 4px;
              margin: 4px;
            }

            .autocomplete {
              display: flex;
              flex-direction: column;
            }

            .result {
              font-size: 1em;
              padding: 8px;
              background: none;
              border: none;
              text-align: left;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              cursor: pointer;
              border: 1px solid black;
            }

            .result:hover {
              background: #cccccc;
            }
          `}
        </style>
      </div>
    );
  }
}

export default Index;
