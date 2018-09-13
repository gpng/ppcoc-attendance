import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

// styles
import { container } from '../stylesheets/general';

const styles = {
  container,
};

const Header = ({ classes }) => (
  <AppBar position="static" color="primary">
    <Toolbar className={classes.container}>
      <Link href="/">
        <Button color="inherit">PPCOC</Button>
      </Link>
    </Toolbar>
  </AppBar>
);

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
