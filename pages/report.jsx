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

// components
import { GetReport } from '../actions';
import auth0Client from '../components/Auth';

// constants
import { SERVICES } from '../constants';

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
  label: {
    marginTop: '12px',
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
    this.reportRequest = new GetReport();
    this.state = {
      absentees: [],
      attendance: {},
      sort: {
        name: 'name',
        order: true, // true = asc, false = desc
      },
    };

    // bindings
    this.setSort = this.setSort.bind(this);
  }

  componentDidMount() {
    if (auth0Client.isAuthenticated()) {
      this.loadReport();
    } else {
      localStorage.setItem('route', '/report');
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

  async loadReport() {
    const [err, report] = await this.reportRequest.call();
    if (!err) {
      this.setState({
        attendance: report.attendance,
        absentees: report.absentees.map(x => ({
          ...x,
          weeks: x.lastAttendance ? this.date.diff(moment(x.lastAttendance), 'weeks') : null,
        })),
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { absentees, attendance, sort } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="overline">{`Report for ${this.date.format('YYYY-MM-DD')}`}</Typography>
        <Typography variant="caption">Attendance</Typography>
        <Table>
          <TableBody>
            {SERVICES.map(x => (
              <TableRow key={x}>
                <TableCell>{x}</TableCell>
                <TableCell>{attendance[x] ? attendance[x] : 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography className={classes.label} variant="caption">
          Absentees
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.header} onClick={() => this.setSort('name')}>
                Name
              </TableCell>
              <TableCell className={classes.header} onClick={() => this.setSort('lastAttendance')}>
                Weeks
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderBy(absentees, [sort.name], [sort.order ? 'asc' : 'desc']).map(x => (
              <TableRow key={x.id}>
                <TableCell>{x.name}</TableCell>
                <TableCell>{x.weeks}</TableCell>
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
