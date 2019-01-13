import React, { Component } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
  },
  chipsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    margin: '4px',
  },
};

class SelectedChips extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, selected, onDelete } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h6">Submit attendance for:</Typography>
        {selected.length === 0 && (
          <Typography>No names selected, search below to add names to list</Typography>
        )}
        <div className={classes.chipsContainer}>
          {selected.map(x => (
            <Chip
              key={x.id}
              label={x.name}
              className={classes.chip}
              onDelete={onDelete ? () => onDelete(x) : null}
            />
          ))}
        </div>
      </div>
    );
  }
}

SelectedChips.defaultProps = {
  onDelete: null,
};

SelectedChips.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
};

export default withStyles(styles)(SelectedChips);
