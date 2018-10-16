import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// components
import auth0Client from '../components/Auth';

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

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (!auth0Client.isAuthenticated()) {
      localStorage.setItem('route', '/admin');
      auth0Client.signIn();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="overline">Admin Menu</Typography>
        <Link prefetch href="report">
          <Button className={classes.button} variant="contained" color="secondary">
            Attendance Report
          </Button>
        </Link>
        <Link prefetch href="members">
          <Button className={classes.button} variant="contained" color="secondary">
            Members List
          </Button>
        </Link>
      </div>
    );
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Admin);
