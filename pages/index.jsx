import React, { Component } from 'react';

import { getAllMembers } from '../actions';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: []
    };
    // bindings
    this.getMembers = this.getMembers.bind(this);
  }

  componentDidMount() {
    this.getMembers();
  }

  async getMembers() {
    const [err, members] = await getAllMembers();
    if (!err) {
      this.setState({ members });
    } else {
      console.log(err);
    }
  }

  render() {
    const { members } = this.state;
    return (
      <div>
        <h1>Welcome to PPCOC's attendance page</h1>
        {members.map(x => (
          <div className="member" key={x.firstName + x.lastName}>
            <div>{`First Name: ${x.firstName}`}</div>
            <div>{`Last Name: ${x.lastName}`}</div>
            <div>{`Contact: ${x.contact ? x.contact : '-'}`}</div>
          </div>
        ))}

        <style jsx>{`
          .member {
            border: 1px solid black;
            padding: 16px;
            border-radius: 4px;
            margin: 4px;
          }
        `}</style>
      </div>
    );
  }
}

export default Index;
