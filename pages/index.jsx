import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = {
  root: {
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
    <Button className={classes.button} variant="contained" color="secondary">
      Members
    </Button>
    <Button className={classes.button} variant="contained" color="secondary">
      Visitors
    </Button>
  </div>
);

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Index);
