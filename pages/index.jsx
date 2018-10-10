import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Fuse from 'fuse.js';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// components
import Result from '../components/Members/Result';
import SelectedChips from '../components/SelectedChips';
import { GetAutocomplete } from '../actions';

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
  },
  results: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: 'scroll',
    padding: '8px 0',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  input: {
    flex: '1 0 auto',
    paddingRight: '24px',
  },
};

class Index extends Component {
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
      const fuse = new Fuse(results, {
        shouldSort: true,
        findAllMatches: true,
        threshold: 1,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ['name'],
      });
      this.setState({ results: fuse.search(query) });
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
        <Typography align="center" variant="overline">
          Enter to Worship, Leave to Serve
        </Typography>
        <SelectedChips onDelete={this.handleClick} selected={selected} />
        <div className={classes.inputContainer}>
          <div className={classes.input}>
            <TextField value={search} onChange={this.handleChange} placeholder="Search" fullWidth />
          </div>
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
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default withStyles(styles)(Index);
