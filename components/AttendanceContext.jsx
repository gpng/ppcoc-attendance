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
    this.handleNotificationClose = this.handleNotificationClose.bind(this);
    this.triggerNotification = this.triggerNotification.bind(this);

    this.state = {
      selected: [],
      setSelected: this.setSelected,
      triggerNotification: this.triggerNotification,
      notification: {
        open: false,
        message: '',
      },
      onNotificationClose: this.handleNotificationClose,
    };
  }

  setSelected(selected) {
    this.setState({ selected });
  }

  triggerNotification(message) {
    this.setState({
      notification: {
        message,
        open: true,
      },
    });
  }

  handleNotificationClose() {
    const { notification } = this.state;
    this.setState({ notification: { ...notification, open: false } });
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
