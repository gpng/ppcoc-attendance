import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { orderBy, uniqBy } from 'lodash';
import { saveAs } from 'file-saver';

// datepicker
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// components
import { GetAllAttendance } from '../actions';
import auth0Client from '../components/Auth';

// constants
import { STARTING_DATE, DATE_FORMAT, STATUS } from '../constants';

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
  downloadRow: {
    marginTop: '12px',
  },
};

class Report extends Component {
  constructor(props) {
    super(props);
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
      excludeInactive: false,
      excludeOverseas: false,
    };

    // bindings
    this.setSort = this.setSort.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
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
    this.searchNames(search);
  }

  handleStartDateChange(date) {
    this.setState({ startDate: date });
  }

  handleEndDateChange(date) {
    this.setState({ endDate: date });
  }

  handleDownload(data) {
    const { excludeInactive, excludeOverseas } = this.state;
    // filter inactive and overseas if selected
    let filteredData = data;
    if (excludeInactive) {
      filteredData = filteredData.filter(x => x.Member.status !== STATUS.INACTIVE);
    }
    if (excludeOverseas) {
      filteredData = filteredData.filter(x => x.Member.status !== STATUS.OVERSEAS);
    }

    let rows = [['Name', 'Service', 'Status', 'Date']];
    rows = rows.concat(
      filteredData.map(x => [
        x.name,
        x.reason,
        x.Member.status,
        moment(x.createdAt).format(DATE_DISPLAY_FORMAT),
      ]),
    );
    const csv = `${rows.map(x => x.join(',')).join('\n')}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const { startDate, endDate } = this.state;
    saveAs(
      blob,
      `PPCOC_Data_${startDate.format('YYYYMMDD')}_${endDate.format('YYYYMMDD')}.csv`,
    );
  }

  render() {
    const { classes } = this.props;
    const {
      attendance,
      sort,
      search,
      startDate,
      endDate,
      excludeInactive,
      excludeOverseas,
    } = this.state;

    const data = orderBy(
      attendance.filter(
        x => moment(x.createdAt).isSameOrBefore(endDate.endOf('day'))
          && moment(x.createdAt).isSameOrAfter(startDate.startOf('day'))
          && (excludeInactive ? x.Member.status !== STATUS.INACTIVE : true)
          && (excludeOverseas ? x.Member.status !== STATUS.OVERSEAS : true),
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
          </div>
        </MuiPickersUtilsProvider>
        <div className={classes.downloadRow}>
          <Button
            className={classes.downloadButton}
            variant="contained"
            color="primary"
            onClick={() => this.handleDownload(data)}
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
              <TableCell className={classes.header} onClick={() => this.setSort('Member.status')}>
                Status
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
                <TableCell>{x.Member.status}</TableCell>
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
