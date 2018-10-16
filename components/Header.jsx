import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import auth0Client from './Auth';

// styles
import { container } from '../stylesheets/general';

const styles = {
  container: {
    ...container,
    display: 'flex',
    justifyContent: 'space-between',
  },
  rightButtons: {
    fontSize: '0.6em',
    color: '#999999',
  },
};

const Header = ({ classes }) => (
  <AppBar position="static" color="primary">
    <Toolbar className={classes.container}>
      <Link href="/">
        <Button color="inherit">PPCOC</Button>
      </Link>
      {auth0Client.isAuthenticated() && (
        <div>
          <Link href="/admin">
            <Button className={classes.rightButtons} color="inherit">
              Admin
            </Button>
          </Link>
          <Button
            className={classes.rightButtons}
            color="inherit"
            onClick={() => auth0Client.signOut()}
          >
            Logout
          </Button>
        </div>
      )}
    </Toolbar>
  </AppBar>
);

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
