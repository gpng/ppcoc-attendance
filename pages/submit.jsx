import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// components
import SelectedChips from '../components/SelectedChips';

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

const Submit = ({ classes, selected }) => (
  <div className={classes.root}>
    <SelectedChips selected={selected} />
    <Button className={classes.button} variant="contained" color="secondary">
      8am Service
    </Button>
    <Button className={classes.button} variant="contained" color="secondary">
      11am Service
    </Button>
    <Button className={classes.button} variant="contained" color="secondary">
      6pm Service
    </Button>
  </div>
);

Submit.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
};

export default withStyles(styles)(Submit);
