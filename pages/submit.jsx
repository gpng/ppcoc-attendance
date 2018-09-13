import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// components
import SelectedChips from '../components/SelectedChips';
import { PostAttendance } from '../actions';

// styles
import { container } from '../stylesheets/general';

const styles = {
  root: {
    ...container,
    paddingTop: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    width: '50%',
    minWidth: '50%',
    margin: '16px 0',
  },
};

class Submit extends Component {
  constructor(props) {
    super(props);
    this.attendanceRequest = new PostAttendance();
    // bindings
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUnmount() {
    this.attendanceRequest.cancel();
  }

  async handleClick(reason) {
    const { selected, triggerNotification } = this.props;
    this.attendanceRequest.cancel();
    const [err] = await this.attendanceRequest.call(selected.map(x => x.id), reason);
    if (!err) {
      triggerNotification('Successfully Submitted');
      Router.push('/');
    }
  }

  render() {
    const { classes, selected } = this.props;

    return (
      <div className={classes.root}>
        <SelectedChips selected={selected} />
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={selected.length === 0}
          onClick={() => this.handleClick('8am service')}
        >
          8am Service
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={selected.length === 0}
          onClick={() => this.handleClick('11am service')}
        >
          11am Service
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={selected.length === 0}
          onClick={() => this.handleClick('6pm service')}
        >
          6pm Service
        </Button>
      </div>
    );
  }
}

Submit.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
};

export default withStyles(styles)(Submit);
