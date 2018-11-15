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

// components
import { GetMembers } from '../actions';
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
};

class Report extends Component {
  constructor(props) {
    super(props);
    this.date = moment().startOf('week');
    this.membersRequest = new GetMembers();
    this.members = [];
    this.state = {
      members: [],
      search: '',
      sort: {
        name: 'name',
        order: true, // true = asc, false = desc
      },
    };

    // bindings
    this.setSort = this.setSort.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    const [err, members] = await this.membersRequest.call();
    if (!err) {
      this.setState({ members });
      this.members = members;
    }
  }

  handleChange(event) {
    const search = event.target.value;
    this.setState({
      search,
    });
    this.searchMembers(search);
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

  render() {
    const { classes } = this.props;
    const { members, sort, search } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="overline">Members List</Typography>
        <TextField label="Search Name" value={search} onChange={this.handleChange} />
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
            </TableRow>
          </TableHead>
          <TableBody>
            {orderBy(members, [sort.name], [sort.order ? 'asc' : 'desc']).map(x => (
              <TableRow key={x.id}>
                <TableCell>{x.name}</TableCell>
                <TableCell>{x.status}</TableCell>
                <TableCell>{x.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

Report.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Report);
