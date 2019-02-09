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
  header: {
    backgroundColor: '#ffffff',
  },
  rightButtons: {
    fontSize: '0.6em',
  },
};

const Header = ({ classes }) => (
  <AppBar position="static" className={classes.header}>
    <Toolbar className={classes.container}>
      <Link href="/">
        <Button color="inherit">
          <img className="logo" src="/static/logo.png" alt="PPCOC" />
        </Button>
      </Link>
      {auth0Client.isAuthenticated() && (
        <div>
          <Link href="/admin">
            <Button className={classes.rightButtons} color="secondary">
              Admin
            </Button>
          </Link>
          <Button
            className={classes.rightButtons}
            color="secondary"
            onClick={() => auth0Client.signOut()}
          >
            Logout
          </Button>
        </div>
      )}
    </Toolbar>
    <style jsx>
      {`
        .logo {
          height: 25px;
        }
      `}
    </style>
  </AppBar>
);

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
