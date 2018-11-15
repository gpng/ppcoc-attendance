/* eslint-disable */
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

import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

// components
import { GetReport } from '../actions';
import auth0Client from '../components/Auth';

// constants
import { SERVICES, STARTING_DATE, DATE_FORMAT } from '../constants';

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
    this.reportRequest = new GetReport();
    this.state = {
      absentees: [],
      attendance: {},
      sort: {
        name: 'name',
        order: true, // true = asc, false = desc
      },
      dates: [],
      selectedDate: null,
    };

    // bindings
    this.setSort = this.setSort.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    localStorage.setItem('route', '/report');
    if (auth0Client.isAuthenticated()) {
      this.loadDateRange();
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

  loadDateRange() {
    const starting = moment(STARTING_DATE, DATE_FORMAT);
    const ending = moment();
    const current = moment(starting);
    const dates = [];
    while (current.isBefore(ending)) {
      dates.push(moment(current));
      current.add(7, 'days');
    }
    const selectedDate = dates[dates.length - 1];
    this.loadReport(selectedDate);
    this.setState({ dates: dates.reverse(), selectedDate });
  }

  async loadReport(date) {
    this.reportRequest.cancel();
    const [err, report] = await this.reportRequest.call(date.format(DATE_FORMAT));
    if (!err) {
      this.setState({
        attendance: report.attendance,
        absentees: report.absentees.map(x => ({
          ...x,
          weeks: x.lastAttendance ? date.diff(moment(x.lastAttendance), 'weeks') : null,
        })),
      });
    }
  }

  handleChange(event) {
    const selectedDate = moment(event.target.value, DATE_FORMAT);
    this.loadReport(selectedDate);
    this.setState({ selectedDate });
  }

  render() {
    const { classes } = this.props;
    const { absentees, attendance, sort, selectedDate, dates } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="overline">
          Report for{' '}
          {selectedDate &&
            dates.length > 0 && (
              <FormControl className={classes.formControl}>
                <NativeSelect value={selectedDate.format(DATE_FORMAT)} onChange={this.handleChange}>
                  {dates.map(x => (
                    <option value={x.format(DATE_FORMAT)} key={x.format(DATE_FORMAT)}>
                      {x.format(DATE_FORMAT)}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            )}
        </Typography>
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
