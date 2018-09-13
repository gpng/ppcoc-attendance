import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';

// components
import Result from '../components/Members/Result';
import { GetAutocomplete } from '../actions';

// styles
import { container } from '../stylesheets/general';

const styles = {
  root: {
    ...container,
    paddingTop: '15px',
    paddingBottom: '15px',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  chipsContainer: {
    display: 'flex',
  },
  chip: {
    margin: '4px',
  },
  results: {
    flex: '1 0 auto',
    maxHeight: '100%',
    overflowY: 'scroll',
    padding: '8px 0',
  },
};

class Members extends Component {
  constructor(props) {
    super(props);
    this.autocompleteRequest = new GetAutocomplete();
    this.state = {
      results: [],
      search: '',
    };
    // bindings
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUnmount() {
    this.autocompleteRequest.cancel();
  }

  async handleAutocomplete(query) {
    if (query === '') {
      this.setState({ results: [] });
      return;
    }
    this.autocompleteRequest.cancel();
    const [err, results] = await this.autocompleteRequest.call(query);
    if (!err) {
      this.setState({ results });
    }
  }

  handleChange(ev) {
    this.setState({
      search: ev.target.value,
    });
    this.handleAutocomplete(ev.target.value);
  }

  handleClick(details) {
    const { selected, setSelected } = this.props;
    const newSelected = selected.slice();
    const index = selected.findIndex(x => x.id === details.id);
    if (index > -1) {
      newSelected.splice(index, 1);
    } else {
      newSelected.push(details);
    }
    setSelected(newSelected);
  }

  render() {
    const { classes, selected } = this.props;
    const { results, search } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="title">Submit attendance for:</Typography>
        {selected.length === 0 && (
          <Typography>No names selected, search below to add names to list</Typography>
        )}
        <div className={classes.chipsContainer}>
          {selected.map(x => (
            <Chip
              key={x.id}
              label={x.name}
              className={classes.chip}
              onDelete={() => this.handleClick(x)}
            />
          ))}
        </div>
        <TextField value={search} onChange={this.handleChange} placeholder="Search" fullWidth />
        <List className={classes.results}>
          {results.map(x => (
            <Result
              key={x.id}
              details={x}
              selected={Boolean(selected.find(s => s.id === x.id))}
              onClick={this.handleClick}
            />
          ))}
        </List>
        <Link href="/submit">
          <Button
            variant="contained"
            color="secondary"
            onClick={this.handleSubmit}
            disabled={selected.length === 0}
          >
            Submit
          </Button>
        </Link>
      </div>
    );
  }
}

Members.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default withStyles(styles)(Members);
