import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { orderBy, uniqBy } from 'lodash';
import { saveAs } from 'file-saver';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// components
import { GetAttendanceReport } from '../actions';
import auth0Client from '../components/Auth';

// constants
import {
  SERVICES, STARTING_DATE, DATE_FORMAT, STATUS,
} from '../constants';

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
  input: {
    flexShrink: 0,
  },
  checkbox: {
    marginRight: '24ox',
  },
};

class AbsenteeReport extends Component {
  constructor(props) {
    super(props);
    this.reportRequest = new GetAttendanceReport();
    this.attendees = [];
    this.state = {
      attendees: [],
      attendance: {},
      sort: {
        name: 'name',
        order: true, // true = asc, false = desc
      },
      dates: [],
      selectedDate: null,
      search: '',
      excludeInactive: false,
      excludeOverseas: false,
    };

    // bindings
    this.setSort = this.setSort.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  componentDidMount() {
    localStorage.setItem('route', '/attendanceReport');
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
    this.attendees = uniqBy(
      report.attendees,
      x => x.reason + moment(x.createdAt).format('YYYYMMDD'),
    ).map(x => ({
      ...x,
      weeks: x.lastAttendance ? date.diff(moment(x.lastAttendance), 'weeks') + 1 : null,
    }));
    if (!err) {
      this.setState({
        attendance: report.attendance,
        attendees: this.attendees,
      });
    }
  }

  handleChange(event) {
    const selectedDate = moment(event.target.value, DATE_FORMAT);
    this.loadReport(selectedDate);
    this.setState({ selectedDate });
  }

  handleCheckboxChange(name) {
    return (event) => {
      this.setState({ [name]: event.target.checked });
    };
  }

  handleSearchChange(event) {
    const search = event.target.value;
    this.setState({
      search,
    });
    this.searchattendees(search);
  }

  handleDownload(data) {
    const { selectedDate, excludeInactive, excludeOverseas } = this.state;

    let rows = [['Name', 'Status', 'Service']];

    // filter inactive and overseas if selected
    let filteredData = data;
    if (excludeInactive) {
      filteredData = filteredData.filter(x => x.Member.status !== STATUS.INACTIVE);
    }
    if (excludeOverseas) {
      filteredData = filteredData.filter(x => x.Member.status !== STATUS.OVERSEAS);
    }

    // generate csv string
    rows = rows.concat(filteredData.map(x => [x.Member.name, x.Member.status, x.reason]));
    const csv = `${rows.map(x => x.join(',')).join('\n')}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `PPCOC_Attendees_${selectedDate.format('YYYYMMDD')}.csv`);
  }

  searchattendees(value) {
    if (value && value !== '') {
      this.setState({
        attendees: this.attendees.filter(
          x => x.name.toLowerCase().indexOf(value.toLowerCase()) > -1,
        ),
      });
    } else {
      this.setState({ attendees: this.attendees });
    }
  }

  render() {
    const { classes } = this.props;
    const {
      attendees,
      attendance,
      sort,
      selectedDate,
      dates,
      search,
      excludeInactive,
      excludeOverseas,
    } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="overline">
          Report for
          {' '}
          {selectedDate
            && dates.length > 0 && (
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
          attendees
        </Typography>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.handleDownload(attendees)}
          >
            Download CSV
          </Button>
          <FormControlLabel
            control={(
              <Checkbox
                checked={excludeInactive}
                onChange={this.handleCheckboxChange('excludeInactive')}
              />
)}
            label="Exclude Inactive"
          />
          <FormControlLabel
            control={(
              <Checkbox
                checked={excludeOverseas}
                onChange={this.handleCheckboxChange('excludeOverseas')}
              />
)}
            label="Exclude Overseas"
          />
        </div>
        <TextField
          label="Search Name"
          value={search}
          onChange={this.handleSearchChange}
          className={classes.input}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.header} onClick={() => this.setSort('Member.name')}>
                Name
              </TableCell>
              <TableCell className={classes.header} onClick={() => this.setSort('Member.status')}>
                Status
              </TableCell>
              <TableCell className={classes.header} onClick={() => this.setSort('reason')}>
                Service
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderBy(
              attendees.filter(
                x => (excludeInactive ? x.Member.status !== STATUS.INACTIVE : true)
                  && (excludeOverseas ? x.Member.status !== STATUS.OVERSEAS : true),
              ),
              [sort.name],
              [sort.order ? 'asc' : 'desc'],
            ).map(x => (
              <TableRow key={x.id}>
                <TableCell>{x.Member.name}</TableCell>
                <TableCell>{x.Member.status}</TableCell>
                <TableCell>{x.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

AbsenteeReport.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AbsenteeReport);
