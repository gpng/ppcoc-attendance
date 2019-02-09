import React, { Component } from 'react';
import PropTypes from 'prop-types';
// material-ui
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// components
import auth0Client from '../components/Auth';
import { PostNewMember } from '../actions';
// styles
import { container } from '../stylesheets/general';

const styles = {
  root: {
    ...container,
    paddingTop: '15px',
    paddingBottom: '15px',
    flexGrow: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll',
  },
  button: {
    marginTop: '1em',
  },
};

class MuiComponent extends Component {
  constructor(props) {
    super(props);
    this.newMemberRequest = new PostNewMember();
    this.state = {
      name: '',
      status: '',
      remarks: '',
    };
    // bindings
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    localStorage.setItem('route', '/new');
    if (!auth0Client.isAuthenticated()) {
      auth0Client.signIn();
    }
  }

  componentWillUnmount() {
    this.newMemberRequest.cancel();
  }

  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }

  async handleClick() {
    const { triggerNotification } = this.props;
    const { name, status, remarks } = this.state;
    this.newMemberRequest.cancel();
    this.newMemberRequest.refreshToken();
    const [err] = await this.newMemberRequest.call(name, status, remarks);
    if (err) {
      triggerNotification('Failed');
      return;
    }
    triggerNotification('Successfully added new member');
    this.setState({ name: '', status: '', remarks: '' });
  }

  render() {
    const { classes } = this.props;
    const { name, status, remarks } = this.state;

    return (
      <div className={classes.root}>
        <TextField
          label="Name"
          value={name}
          onChange={this.handleChange('name')}
          className={classes.input}
        />
        <TextField
          label="Status (A, B, O, I)"
          value={status}
          onChange={this.handleChange('status')}
          className={classes.input}
        />
        <TextField
          label="Remarks"
          value={remarks}
          onChange={this.handleChange('remarks')}
          className={classes.input}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={this.handleClick}
        >
          Add Member
        </Button>
      </div>
    );
  }
}

MuiComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MuiComponent);
