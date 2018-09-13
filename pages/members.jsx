import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';

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
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
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
        <SelectedChips onDelete={this.handleClick} selected={selected} />
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
