import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// styles
import { container } from '../stylesheets/general';

const styles = {
  root: {
    ...container,
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

const Index = ({ classes }) => (
  <div className={classes.root}>
    <Link prefetch href="members">
      <Button className={classes.button} variant="contained" color="secondary">
        Members
      </Button>
    </Link>
    <Link prefetch href="visitors">
      <Button className={classes.button} variant="contained" color="secondary">
        Visitors
      </Button>
    </Link>
  </div>
);

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Index);
