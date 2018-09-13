/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const AttendanceContext = React.createContext();

const AttendanceConsumer = AttendanceContext.Consumer;

// Then create a provider Component
class AttendanceProvider extends Component {
  constructor(props) {
    super(props);

    // bindings
    this.setSelected = this.setSelected.bind(this);

    this.state = {
      selected: [],
      setSelected: this.setSelected,
    };
  }

  setSelected(selected) {
    this.setState({ selected });
  }

  render() {
    const { children } = this.props;

    return <AttendanceContext.Provider value={this.state}>{children}</AttendanceContext.Provider>;
  }
}

AttendanceProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};

export { AttendanceConsumer, AttendanceProvider };
