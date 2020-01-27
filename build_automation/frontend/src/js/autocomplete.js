import PropTypes from 'prop-types';
import React from 'react';

import Downshift from 'downshift';
import keycode from 'keycode';

import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';


const MAX_COUNT = 10;

/*
 * This file is a modified version of https://github.com/mui-org/material-ui/blob/e61ffeab3c432506829d118fb173b0dc336e224a/docs/src/pages/demos/autocomplete/IntegrationDownshift.js
 */

/*
* Render the user's input
*/
function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;

    return (
        <TextField InputProps={{ inputRef: ref, classes: { root: classes.inputRoot, }, ...InputProps, }} {...other} />
    );
}
/*
* Render suggestions for items that are in the defaults
*/
function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem, searchKey }) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(suggestion[searchKey]) > -1;

    return (
        <MenuItem {...itemProps} key={suggestion[searchKey]} selected={isHighlighted} component="div" style={{ fontWeight: isSelected ? 500 : 400, }}>
            {suggestion[searchKey]}
        </MenuItem>
    );
}
/*
* Render suggestions for props that aren't default
*/
renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.number,
    index: PropTypes.number,
    itemProps: PropTypes.object,
    selectedItem: PropTypes.string,
    suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};
/*
* Get autocomplete suggestions based off of inputValue
*/
function getSuggestions(suggestions, inputValue, maxCount, searchKey) {
    let count = 0;

    return suggestions.filter(suggestion => {
        const keep =
        (!inputValue || suggestion[searchKey].toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
            count < maxCount;

        if (keep) {
            count += 1;
        }

        return keep;
    });
}
/*
* Constructor for autocomplete
*/
class AutoCompleteWithChips extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            selectedItem: props.selectedItem,
        };
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    /*
    * Load all the components with the appropriate data
    */
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            inputValue: '',
            selectedItem: props.selectedItem
        })
    }
    /*
    * Handle the user partially deleting their input
    */
    handleKeyDown(evt) {
        const { inputValue, selectedItem } = this.state;
        if (selectedItem.length && !inputValue.length && keycode(evt) === 'backspace') {
            this.setState({
                selectedItem: selectedItem.slice(0, selectedItem.length - 1),
            });
        }
    };
    /*
    * Handle the change in the user's input
    */
    handleInputChange(evt) {
        this.setState({ inputValue: evt.target.value });
    };
    /*
    * Edit an item in the autocomplete list
    */
    handleChange(item) {
        let { selectedItem } = this.state;
        const maxChips = this.props.maxChips;
        //Is max chips greater than 0
        if (maxChips > 0 && selectedItem.length >= maxChips) {
            return;
        }
        //Handle nulls
        if (selectedItem.indexOf(item) === -1) {
            if (this.props.onAddition) {
                var selectedSuggestion = null;
                for (var i=0; i<this.props.suggestions.length; i++) {
                    if(this.props.suggestions[i][this.props.searchKey] == item) {
                        selectedSuggestion = this.props.suggestions[i];
                        break;
                    }
                }
                this.props.onAddition(selectedSuggestion);
            } else {
                selectedItem = [...selectedItem, item];
                this.setState({inputValue: '', selectedItem});
            }
        }
    };
    /*
    * Delete an item from the autocomplete list
    */
    handleDelete(item) {
        if (this.props.onDeletion) {
            var removedChip = null;
            for (var i=0; i<this.props.suggestions.length; i++) {
                if(this.props.suggestions[i][this.props.searchKey] == item) {
                    removedChip = this.props.suggestions[i];
                }
            }
            this.props.onDeletion(removedChip);
        } else {
            const selectedItem = [...this.state.selectedItem];
            selectedItem.splice(selectedItem.indexOf(item), 1);
            this.setState({ selectedItem });
        }
    };
    /*
    * Render function for autocomplete
    */
    render() {
        const { classes } = this.props;
        const { inputValue, selectedItem } = this.state;

        return (
            <Downshift inputValue={inputValue} onChange={this.handleChange} selectedItem={selectedItem}>
                {({
                getInputProps,
                getItemProps,
                isOpen,
                inputValue: inputValue2,
                selectedItem,
                highlightedIndex,
                }) => (
                    <div className={classes.container}>
                        {
                            renderInput({
                                fullWidth: true,
                                classes,
                                InputProps: getInputProps({
                                    startAdornment: selectedItem.map(item => (
                                        <Chip
                                            key={item}
                                            tabIndex={-1}
                                            label={item}
                                            className={classes.chip}
                                            onDelete={evt => this.handleDelete(item)}
                                        />
                                    )),
                                    onChange: this.handleInputChange,
                                    onKeyDown: this.handleKeyDown,
                                    placeholder: this.props.placeholder,
                                    id: this.props.id,
                                    required: this.props.required,
                                    error: this.props.errorMsg ? true : false
                                }),
                            })
                        }
                        {
                            isOpen ? (
                                <Paper className={classes.paper} square>
                                    {
                                        getSuggestions(this.props.suggestions, inputValue2, this.props.maxCount || MAX_COUNT, this.props.searchKey).map((suggestion, index) =>
                                            renderSuggestion({
                                                suggestion,
                                                index,
                                                itemProps: getItemProps({ item: suggestion[this.props.searchKey] }),
                                                highlightedIndex,
                                                selectedItem,
                                                searchKey: this.props.searchKey,
                                            }),
                                        )
                                    }
                                    {
                                        this.props.onAddNew && this.state.inputValue.length > 0 &&
                                            <MenuItem style={{ backgroundColor: '#3F51B5', color: 'white' }} onClick={evt=>this.props.onAddNew(this.state.inputValue)} selected={true} component="div">
                                                Add New
                                            </MenuItem>
                                    }
                                </Paper>
                            ) : null
                        }
                    </div>
                )}
            </Downshift>
        );
    }
}
/*
* Autocomplete for our specific chips
*/
AutoCompleteWithChips.propTypes = {
    classes: PropTypes.object.isRequired,
    suggestions: PropTypes.array,
    onAddition: PropTypes.func,
    onDeletion: PropTypes.func,
    onAddNew: PropTypes.func,
    required: PropTypes.bool,
    errorMsg: PropTypes.string,
    searchKey: PropTypes.string,
    maxChips: PropTypes.number,
};
/*
* Default chips
*/
AutoCompleteWithChips.defaultProps = {
    required: false,
    errorMsg: null,
    searchKey: 'name',
    maxChips: 0,
};
/*
* Default styles for autocomplete
*/
const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing(1/2)}px ${theme.spacing(1/4)}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
});

export default withStyles(styles)(AutoCompleteWithChips);
