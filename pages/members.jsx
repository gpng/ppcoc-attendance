import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { orderBy } from 'lodash';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

// components
import { GetMembers, UpdateMember } from '../actions';
import auth0Client from '../components/Auth';

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
  header: {
    cursor: 'pointer',
    '&:hover': {
      color: '#000000',
    },
  },
  input: {
    flexShrink: 0,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  saveButton: {
    backgroundColor: 'green',
  },
};

class Report extends Component {
  constructor(props) {
    super(props);
    this.date = moment().startOf('week');
    this.membersRequest = new GetMembers();
    this.updateMemberRequest = new UpdateMember();
    this.members = [];
    this.state = {
      members: [],
      search: '',
      sort: {
        name: 'name',
        order: true, // true = asc, false = desc
      },
      open: false,
      name: '',
      status: '',
      remarks: '',
    };

    // bindings
    this.setSort = this.setSort.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.close = this.close.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    localStorage.setItem('route', '/members');
    if (auth0Client.isAuthenticated()) {
      this.loadMembers();
    } else {
      auth0Client.signIn();
    }
  }

  setSort(name) {
    const { sort } = this.state;
    const order = name === sort.name ? !sort.order : true;
    this.setState({
      sort: {
        name,
        order,
      },
    });
  }

  async loadMembers() {
    this.membersRequest.cancel();
    this.membersRequest.refreshToken();
    const [err, members] = await this.membersRequest.call();
    if (!err) {
      this.setState({ members });
      this.members = members;
      const { search } = this.state;
      this.searchMembers(search);
    }
  }

  handleChange(event) {
    const search = event.target.value;
    this.setState({
      search,
    });
    this.searchMembers(search);
  }

  handleFormChange(name) {
    return (event) => {
      this.setState({ [name]: event.target.value });
    };
  }

  searchMembers(value) {
    if (value && value !== '') {
      this.setState({
        members: this.members.filter(x => x.name.toLowerCase().indexOf(value.toLowerCase()) > -1),
      });
    } else {
      this.setState({ members: this.members });
    }
  }

  handleClick(member) {
    const {
      id, name, status, remarks,
    } = member;
    this.setState({
      open: id,
      name,
      status,
      remarks,
    });
  }

  async handleSave() {
    const { triggerNotification } = this.props;
    const {
      open, name, status, remarks,
    } = this.state;
    const [err] = await this.updateMemberRequest.call(open, name, status, remarks);
    if (!err) {
      triggerNotification('Successfully Updated');
      this.loadMembers();
      this.close();
    } else {
      triggerNotification(err);
    }
  }

  close() {
    this.setState({
      open: false,
      name: '',
      status: '',
      remarks: '',
    });
  }

  render() {
    const { classes } = this.props;
    const {
      members, sort, search, open, name, status, remarks,
    } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="overline">Members List</Typography>
        <TextField
          label="Search Name"
          value={search}
          onChange={this.handleChange}
          className={classes.input}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.header} onClick={() => this.setSort('name')}>
                Name
              </TableCell>
              <TableCell className={classes.header} onClick={() => this.setSort('status')}>
                Status
              </TableCell>
              <TableCell className={classes.header} onClick={() => this.setSort('remarks')}>
                Remarks
              </TableCell>
              <TableCell className={classes.header} />
            </TableRow>
          </TableHead>
          <TableBody>
            {orderBy(members, [sort.name], [sort.order ? 'asc' : 'desc']).map(x => (
              <TableRow key={x.id} onClick={() => this.handleClick(x)}>
                <TableCell>{x.name}</TableCell>
                <TableCell>{x.status}</TableCell>
                <TableCell>{x.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={Boolean(open)} onClose={this.close} aria-labelledby="form-dialog-title">
          <DialogTitle>Edit Member</DialogTitle>
          <DialogContent>
            <TextField
              onChange={this.handleFormChange('name')}
              autoFocus
              margin="dense"
              value={name}
              label="Name"
              type="text"
              fullWidth
            />
            <TextField
              onChange={this.handleFormChange('status')}
              margin="dense"
              value={status}
              label="Status"
              type="text"
              fullWidth
            />
            <TextField
              onChange={this.handleFormChange('remarks')}
              margin="dense"
              value={remarks}
              label="Remarks"
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSave} color="primary" className={classes.saveButton}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Report.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Report);
