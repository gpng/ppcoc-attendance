import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import classNames from 'classnames';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// styles
import Typography from '@material-ui/core/Typography';
import { container } from '../stylesheets/general';

const styles = {
  root: {
    ...container,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '12px',
  },
  button: {
    width: '50%',
    minWidth: '50%',
    margin: '16px 0',
  },
  message: {
    fontSize: '1em',
    textAlign: 'center',
  },
  messageBottom: {
    marginTop: '12px',
  },
};

const Index = ({ classes }) => (
  <div className={classes.root}>
    <Typography className={classes.message}>Welcome to our Worship Services!</Typography>
    <Typography className={classes.message}>Let us worship God in Spirit and in Truth.</Typography>
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
    <Typography className={classNames(classes.message, classes.messageBottom)}>
      Enter to Worship, Leave to Serve.
    </Typography>
  </div>
);

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Index);
