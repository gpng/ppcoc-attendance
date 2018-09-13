import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = {
  snackbar: {
    background: '#43a047',
  },
};

const Notification = ({
  classes, open, message, onClose,
}) => (
  <Snackbar
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    open={open}
    autoHideDuration={2000}
    onClose={onClose}
  >
    <SnackbarContent
      className={classes.snackbar}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">{message}</span>}
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />
  </Snackbar>
);

Notification.defaultProps = {
  open: false,
};

Notification.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(Notification);
