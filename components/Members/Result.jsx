import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';

const styles = {
  selected: {
    color: 'green',
  },
};

class Result extends Component {
  constructor(props) {
    super(props);
    // bindings
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { details, onClick } = this.props;
    onClick(details);
  }

  render() {
    const {
      classes,
      details: { name },
      selected,
    } = this.props;

    return (
      <ListItem button onClick={this.handleClick}>
        <ListItemIcon>
          <CheckCircleOutline className={classNames({ [classes.selected]: selected })} />
        </ListItemIcon>
        <ListItemText>{name}</ListItemText>
      </ListItem>
    );
  }
}

Result.defaultProps = {
  selected: false,
};

Result.propTypes = {
  classes: PropTypes.object.isRequired,
  details: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(Result);
