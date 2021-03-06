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
    localStorage.setItem('route', '/admin');
    if (!auth0Client.isAuthenticated()) {
      auth0Client.signIn();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="overline">Admin Menu</Typography>
        <Link href="/attendanceReport">
          <Button className={classes.button} variant="contained" color="primary">
            Weekly Attendance Report
          </Button>
        </Link>
        <Link href="/absenteeReport">
          <Button className={classes.button} variant="contained" color="primary">
            Weekly Absentees Report
          </Button>
        </Link>
        <Link href="/members">
          <Button className={classes.button} variant="contained" color="primary">
            Members List
          </Button>
        </Link>
        <Link href="/extractData">
          <Button className={classes.button} variant="contained" color="primary">
            Extract attendance data
          </Button>
        </Link>
        <Link href="/new">
          <Button className={classes.button} variant="contained" color="primary">
            Add New Member
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
