/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { orderBy, uniqBy } from 'lodash';
import { saveAs } from 'file-saver';

// datepicker
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// components
import { GetReport, GetAllAttendance } from '../actions';
import auth0Client from '../components/Auth';

// constants
import { STARTING_DATE, DATE_FORMAT } from '../constants';

// styles
import { container } from '../stylesheets/general';

const DATE_DISPLAY_FORMAT = 'YYYY-MM-DD HH:mm:ss';

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
  dateWrapper: {
    display: 'flex',
    flexShrink: 0,
  },
  to: {
    margin: '0 2em',
  },
  inputContainer: {
    flexShrink: 0,
    width: '100%',
  },
  downloadButton: {
    marginRight: '12px',
  },
};

class Report extends Component {
  constructor(props) {
    super(props);
    this.reportRequest = new GetReport();
    this.attendanceRequest = new GetAllAttendance();
    this.attendance = [];
    this.state = {
      attendance: [],
      sort: {
        name: 'createdAt',
        order: false, // true = asc, false = desc
      },
      startDate: moment(STARTING_DATE, DATE_FORMAT),
      endDate: moment(),
      search: '',
    };

    // bindings
    this.setSort = this.setSort.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  componentDidMount() {
    localStorage.setItem('route', '/extractData');
    if (auth0Client.isAuthenticated()) {
      this.loadAttendance();
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

  async loadAttendance() {
    this.attendanceRequest.cancel();
    const [err, rawAttendance] = await this.attendanceRequest.call();
    const attendance = uniqBy(
      rawAttendance,
      x => x.reason + moment(x.createdAt).format('YYYYMMDD'),
    ).map(x => ({ ...x, name: x.Member.name }));
    if (!err) {
      this.attendance = attendance;
      this.setState({
        attendance,
      });
    }
  }

  searchNames(value) {
    if (value && value !== '') {
      this.setState({
        attendance: this.attendance.filter(
          x => x.name.toLowerCase().indexOf(value.toLowerCase()) > -1,
        ),
      });
    } else {
      this.setState({ attendance: this.attendance });
    }
  }

  handleSearchChange(event) {
    const search = event.target.value;
    this.setState({
      search,
    });
    this.searchNames(search);
  }

  handleStartDateChange(date) {
    this.setState({ startDate: date });
  }

  handleEndDateChange(date) {
    this.setState({ endDate: date });
  }

  handleDownload(data) {
    let rows = [['Name', 'Service', 'Date']];
    rows = rows.concat(
      data.map(x => [x.name, x.reason, moment(x.createdAt).format(DATE_DISPLAY_FORMAT)]),
    );
    const csv = `${rows.map(x => x.join(',')).join('\n')}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const { startDate, endDate } = this.state;
    saveAs(
      blob,
      `PPCOC_Attendance_${startDate.format('YYYYMMDD')}_${endDate.format('YYYYMMDD')}.csv`,
    );
  }

  render() {
    const { classes } = this.props;
    const { attendance, sort, search, startDate, endDate } = this.state;

    const data = orderBy(
      attendance.filter(
        x =>
          moment(x.createdAt).isSameOrBefore(endDate.endOf('day')) &&
          moment(x.createdAt).isSameOrAfter(startDate.startOf('day')),
      ),
      [sort.name],
      [sort.order ? 'asc' : 'desc'],
    );

    return (
      <div className={classes.root}>
        <Typography variant="overline">All attendance data</Typography>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <div className={classes.dateWrapper}>
            <div>
              <DatePicker
                value={startDate}
                onChange={this.handleStartDateChange}
                minDate={moment(STARTING_DATE, DATE_FORMAT)}
                maxDate={moment()}
                format={DATE_FORMAT}
              />
            </div>
            <Typography variant="overline" className={classes.to}>
              to
            </Typography>
            <div>
              <DatePicker
                value={endDate}
                onChange={this.handleEndDateChange}
                minDate={moment(STARTING_DATE, DATE_FORMAT)}
                maxDate={moment()}
                format={DATE_FORMAT}
              />
            </div>
            <Button
              className={classes.downloadButton}
              variant="contained"
              color="primary"
              onClick={() => this.handleDownload(data)}
            >
              Download CSV
            </Button>
          </div>
        </MuiPickersUtilsProvider>
        <div className={classes.inputContainer}>
          <TextField
            label="Search Name"
            value={search}
            onChange={this.handleSearchChange}
            fullWidth
          />
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.header} onClick={() => this.setSort('name')}>
                Name
              </TableCell>
              <TableCell className={classes.header} onClick={() => this.setSort('reason')}>
                Service
              </TableCell>
              <TableCell className={classes.header} onClick={() => this.setSort('createdAt')}>
                Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(x => (
              <TableRow key={x.id}>
                <TableCell>{x.name}</TableCell>
                <TableCell>{x.reason}</TableCell>
                <TableCell>{moment(x.createdAt).format(DATE_DISPLAY_FORMAT)}</TableCell>
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
