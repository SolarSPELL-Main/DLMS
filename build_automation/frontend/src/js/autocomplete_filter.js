import PropTypes from 'prop-types';
import React from 'react';

import AutoCompleteWithChips from './autocomplete.js';
/*
* Constructor for autocomplete filter
*/
class AutoCompleteFilter extends React.Component {
    constructor(props) {
        super(props);
        const { filter } = props;
        const filterValues = filter ? filter.value : [];
        this.state = {
            selectedItem: this.getSelectedItemFromFilterValues(filterValues),
        };
        this.filterValues = filterValues;
        this.handleChipAddition = this.handleChipAddition.bind(this);
        this.handleChipDeletion = this.handleChipDeletion.bind(this);
    }
    /*
    * Populate all the data
    */
    UNSAFE_componentWillReceiveProps(props) {
        const { filter } = props;
        const filterValues = filter ? filter.value : [];
        this.filterValues = filterValues;
        this.setState({
            selectedItem: this.getSelectedItemFromFilterValues(filterValues),
        });
    }
    /*
    * Function to pick out one item out of all the filtered items
    */
    getSelectedItemFromFilterValues(filterValues) {
        const selectedItems = [];
        this.props.suggestions.forEach(eachSuggestion => {
            filterValues.indexOf(eachSuggestion[this.props.filterKey]) != -1 && selectedItems.push(eachSuggestion[this.props.searchKey]);
        });
        return selectedItems;
    }
    /*
    * Update the list of values for an addition
    */
    handleChipAddition(addedChip) {
        this.filterValues.push(addedChip[this.props.filterKey]);
        this.props.onFilter({ value: this.filterValues });
    }
    /*
    * Update the list of values for a deletion
    */
    handleChipDeletion(deletedChip) {
        this.filterValues.splice(this.filterValues.indexOf(deletedChip[this.props.filterKey]), 1);
        this.props.onFilter((this.filterValues.length > 0 ? {value: this.filterValues} : null));
    }
    /*
    * Render the suggestions from autocomplete
    */
    render() {
        return (
            <AutoCompleteWithChips suggestions={this.props.suggestions} selectedItem={this.state.selectedItem} onAddition={this.handleChipAddition} onDeletion={this.handleChipDeletion} />
        );
    }
}
/*
* Types of props to filter by
*/
AutoCompleteFilter.propTypes = {
    suggestions: PropTypes.array.isRequired,
    onFilter: PropTypes.func.isRequired,
    filter: PropTypes.object,
    searchKey: PropTypes.string,
    filterKey: PropTypes.string,
};
/*
* Default props in case none are provided
*/
AutoCompleteFilter.defaultProps = {
    searchKey: 'name',
    filterKey: 'id',
};

export default AutoCompleteFilter;
