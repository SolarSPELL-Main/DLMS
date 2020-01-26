import React from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import AutoCompleteFilter from './autocomplete_filter.js';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from "@material-ui/core/Checkbox"
import classNames from "classnames";
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { APP_URLS } from './url';
import { ActionPanel } from "./action_panel";
import { CheckCircleOutline, HighlightOff, Description } from "@material-ui/icons"
import { get } from "lodash"

import {
    DataTypeProvider,
    FilteringState,
    IntegratedFiltering,
    PagingState,
    SearchState,
    CustomPaging,
    SortingState,
    IntegratedSorting
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
	Toolbar,
    TableHeaderRow,
    TableFilterRow,
    TableColumnResizing,
    PagingPanel,
	SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';

const styles = theme => ({
	title: {
		color: '#75B2dd',
		fontSize: '16px',	
	}
});

/* const HighlightedCell = (value) => (
  <Table.Cell>
    <span
      style={{
        color: '#3592BE',
      }}
    >
      {value}
    </span>
  </Table.Cell>
);

const Cell = (props) => {
	return <HighlightedCell {...props} />;
}; */

//Simple component for displaying information about a given content
const FileInfoEntry = (props) => {
    const { name, property, selectedFile } = props
    const displayFn = props.displayFn || (data => String(data))
    const data = get(selectedFile, property, null)
    return (
        <>
            <Typography component={'span'} variant="h6" color="primary">{name}</Typography>
            <br />
            <Typography component={'span'} variant="body1">{data ? displayFn(data) : ""}</Typography>
            <br />
            <br />
        </>
    )
}

const styles2 = {
  customHeaderCell: {
    '& div': {
		color: '#3592BE',
		fontSize: '18px',
    }
    /*your styles here*/
  }
};

const searchStyle = {
  customSearchCell: {
    '& div': {
		width: '35%',
		marginBottom: '0',
		marginTop: '0',
		marginLeft: '0',
		marginRight: '0',
    }
    /*your styles here*/
  }
};

const toolbarStyles = {
  customToolbar: {
    width: "100%",
	backgroundColor: "#FAFAFA",
	boxShadow: "0 4px 4px -4px rgba(0,0,0,0.21)",
  }
};
const ToolbarRootBase = ({ classes, className, ...restProps }) => (
  <Toolbar.Root
    className={classNames(className, classes.customToolbar)}
    {...restProps}
  />
);

const ToolbarRoot = withStyles(toolbarStyles)(ToolbarRootBase);

const CustomSearchBase = ({ classes, ...restProps }) => {
	return <SearchPanel.Cell className={classes.customSearchCell} {...restProps} />
}

export const CustomSearchCell = withStyles(searchStyle)(CustomSearchBase);


const CustomTableHeaderCellBase = ({ classes, ...restProps }) => {

  restProps.value = restProps.column.title || restProps.column.name;
  return <TableHeaderRow.Cell className={classes.customHeaderCell} {...restProps} />
}
export const CustomTableHeaderCell = withStyles(styles2)(CustomTableHeaderCellBase);


var __tagIdsTagsMap = {};
/*
* Format tags
*/
function ChippedTagsFormatter(input) {
    const {row, column, value} = input;
    if (!value){
        return "";
    }
    const allChips = [];
    //If value equals number
    if (typeof(value)=='number') {
        allChips.push(<Chip key={row.id + '_' + column['name'] + '_' + value} label={__tagIdsTagsMap[column['name']
        +'s'][value]['name']} />);
    }
    else {
        value.forEach(eachTagId => {
            allChips.push(<Chip key={row.id + '_' + column['name'] + '_' + eachTagId}
                                label={__tagIdsTagsMap[column['name']][eachTagId]['name']}/>);
        });
    }
    return allChips;
}
/*
* What data type is the tag?
*/
function ChippedTagsTypeProvider(props) {
    return (<DataTypeProvider formatterComponent={ChippedTagsFormatter} {...props} />);
}
/*
* Filter through an array of tags
*/
function filterThroughArray(value, filter) {
    if ( value && filter && Array.isArray(filter.value)) {
        if(!Array.isArray(value)) {
            value = [value];
        }
        let allTagsPresent = true;
        filter.value.forEach(eachFilterTag => {
            allTagsPresent = allTagsPresent && (value.indexOf(eachFilterTag) != -1);
        });
        return allTagsPresent;
    }
}

/*
* Constructor for file list
*/
class FileListComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            allFilesMenu: {
                selectedFile: null,
                AnchorPos: null
            },
            confirmDelete: false,
            contentDialogOpen: false,
            selectedFile: null,
            pageSize: 10,
            currentPage: 1,
            filters: []
        };
        __tagIdsTagsMap = props.tagIdsTagsMap;
        this.columns = [
            {name: 'actions', title: 'Actions', filterType: 'none',
            getCellValue: row => (
                <ActionPanel
                    row={row}
                    editFn={evt => {props.onEdit(row)}}
                    deleteFn={evt => {
                        this.setState({
                            selectedFile: row,
                            confirmDelete: true
                        })
                    }}
                    viewFn={evt => {
                        this.setState({
                            selectedFile: row,
                            contentDialogOpen: true
                        })
                    }}
                    setActive={new_active => {
                        const payload = new FormData()
                        payload.append('active', new_active ? 1 : 0)
                        axios.patch(APP_URLS.CONTENT_DETAIL(row.id), payload, {
                            responseType: 'json'
                        }).then(() => {
                            this.props.getFiles(this.state.currentPage, this.state.pageSize, this.state.filters)
                        })
                    }}
                />
            )},
            {name: 'name', title: 'Name', filterType: 'textfield'},
            {name: 'original_file_name', title: 'Filename', filterType: 'textfield'},
            {name: 'creators', title: 'Creators', filterType: 'autocomplete', tagKey: 'creators'},
            {name: 'updated_time', title: 'Updated on', filterType: 'textfield', placeholder: "MM/DD/YYYY-MM/DD/YYYY"},
            {name: 'description', title: 'Description', filterType: 'textfield'},
            {name: 'language', title: 'Language', filterType: 'autocomplete', tagKey: 'languages'},
            //TODO: Add Collection Type and Resource Type column + filter
            //TODO: fix date filter
            {name: 'subjects', title: 'Subjects', filterType: 'autocomplete', tagKey: 'subjects'},
            {name: 'collections', title: 'Collections', filterType: 'autocomplete', tagKey: 'collections'},
            {name: 'keywords', title: 'Keywords', filterType: 'autocomplete', tagKey: 'keywords'},
            {name: 'active', title: 'Active', filterType: 'boolean', getCellValue: row => row.active == 1 ? <CheckCircleOutline /> : <HighlightOff />}
        ];
        this.deleteCallback = props.onDelete;
        this.editCallback = props.onEdit;
        this.closeDialog = this.closeDialog.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.handleFilesRightClick = this.handleFilesRightClick.bind(this);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
        this.getFilterCellComponent = this.getFilterCellComponent.bind(this);
        this.filterExtensions = [
            {columnName: 'actions', filteringEnabled: false},
            {columnName: 'creators', predicate: filterThroughArray},
            {columnName: 'coverage', predicate: filterThroughArray},
            {columnName: 'subjects', predicate: filterThroughArray},
            {columnName: 'keywords', predicate: filterThroughArray},
            {columnName: 'workareas', predicate: filterThroughArray},
            {columnName: 'language', predicate: filterThroughArray},
            {columnName: 'cataloger', predicate: filterThroughArray},
            {columnName: 'collections', predicate: filterThroughArray}
        ];
        this.setCurrentPage = this.setCurrentPage.bind(this)
        this.setPageSize = this.setPageSize.bind(this)
        this.setFilters = this.setFilters.bind(this)
        this.pageSizes = [1, 10, 20]
    }

    //Initial data grab after mount
    componentDidMount() {
        __tagIdsTagsMap = this.props.tagIdsTagsMap;
        this.props.getFiles(this.state.currentPage, this.state.pageSize, this.state.filters)
    }
    /*
    * Components will load data
    */
    componentDidUpdate(prevProps) {
        if (this.props.allFiles != prevProps.allFiles) {
            __tagIdsTagsMap = this.props.tagIdsTagsMap
        }
    }
    
    setFilters(filters) {
        this.setState({
            filters,
            currentPage: 1
        }, this.onPagingChanged)
    }

    /*
    * Right click options
    */
    handleFilesRightClick(evt, row, menuName) {
        this.setState({
            [menuName]: {
                selectedFile: row,
                AnchorPos: {top:evt.clientY, left:evt.clientX}
            },
            selectedFile: row
        });
        evt.preventDefault();
    }
    /*
    * Close menu
    */
    handleMenuClose(evt, menuName) {
        this.setState({
            [menuName]: {
                selectedFile: null,
                AnchorPos: null
            }
        });
    }
    /*
    * Rows
    */
    tableRowComponent(obj, menuName)  {
        const {row, children} = obj;
        return(
            <tr
                onContextMenu={evt => this.handleFilesRightClick(evt, row, menuName)}
            >
                {children}
            </tr>
        );
    }
    /*
    * Delete a file
    */
    deleteFile(file) {
        const targetUrl = APP_URLS.CONTENT_DETAIL(file.id);
        const currentInstance = this;
        axios.delete(targetUrl).then(function (response) {
            if (currentInstance.deleteCallback){
                currentInstance.deleteCallback(file);
            }
        }).catch(function (error) {
            console.error("Error in deleting the file ", error);
        });
    }
    /*
    * Confirm request for deletion
    */
    confirmDeleteContent() {
        this.setState({
            confirmDelete: true
        })
    }
    /*
    * Abort confirmation
    */
    closeDialog(dialogName) {
        this.setState({[dialogName]: false})
    }
    /*
    * Get filtered items
    */
    getFilterCellComponent(props) {
        const {filter, onFilter, column, filteringEnabled} = props;
        switch(column.filterType) {
            case "autocomplete":
                const { tagKey } = column;
                return (
                    <TableCell style={{paddingLeft: '10px', paddingRight: '5px'}}>
                        <AutoCompleteFilter filter={filter} suggestions={this.props.tags[tagKey]} onFilter={onFilter} />
                    </TableCell>
                );
            case "boolean":
                const [checked, setChecked] = React.useState(true)
                return (
                    <TableCell style={{paddingLeft: '10px', paddingRight: '5px'}}>
                        <Checkbox
                            checked={checked}
                            color="primary"
                            onChange={e => {
                                setChecked(e.target.checked)
                                onFilter({
                                    columnName: column.name,
                                    operation: 'equal',
                                    value: e.target.checked
                                })
                            }}
                        />
                    </TableCell>
                )
            case "textfield":
                return (
                    <TableCell style={{paddingLeft: '10px', paddingRight: '5px'}}>
                        <Input
                            fullWidth
                            value={filter ? filter.value : ''}
                            placeholder={column.placeholder == null ? 'Filter...' : column.placeholder}
                            onChange={evt => onFilter(evt.target.value ? { value: evt.target.value } : null)}
                        />
                    </TableCell>
                )
            default:
                return <TableCell />
        }
    }
    
    onPagingChanged() {
        this.props.getFiles(this.state.currentPage, this.state.pageSize, this.state.filters)
    }

    setCurrentPage(newPage) {
        this.setState({currentPage: newPage + 1}, this.onPagingChanged)
    }
    setPageSize(newPageSize) {
        this.setState({
            pageSize: newPageSize,
            currentPage: 1
        }, this.onPagingChanged)
    }

    /*
    * Render class for file list
    */
    render() {
        return (
            <React.Fragment>
                <Grid
                    rows={this.props.allFiles}
                    columns={this.columns}
					style={{color: '#3592BE'}}
                >
                    <ChippedTagsTypeProvider for={['creators', 'coverage', 'subjects', 'keywords', 'workareas', 'language', 'cataloger', 'collections']} />
                    <FilteringState
                        defaultFilters={[]}
                        columnExtensions={[{columnName: 'content_file', filteringEnabled: false}]}
                        onFiltersChange={this.setFilters}
                    />
                    <DataTypeProvider
                        for={["updated_time"]}
                    />
                    <PagingState
                        currentPage={this.state.currentPage - 1}
                        onCurrentPageChange={this.setCurrentPage}
                        pageSize={this.state.pageSize}
                        onPageSizeChange={this.setPageSize}
                    />
                    <CustomPaging totalCount={this.props.totalCount} />
                    <SortingState
                        defaultSorting={[{columnName: "name", direction: "asc"}]}
                    />
                    <IntegratedSorting />
                    <Table style={{width: '100%', color: '#3592BE', fontFamily: 'Asap', fontWeight: 'bold', borderStyle: 'none',}} rowComponent={obj => {return this.tableRowComponent(obj, 'allFilesMenu')}} />
                    <TableColumnResizing
                        defaultColumnWidths={[
                            { columnName: 'actions', width: 150},
                            { columnName: 'name', width: 150 },
                            { columnName: 'original_file_name', width: 150 },
                            { columnName: 'creators', width: 130 },
                            { columnName: 'updated_time', width: 150 },
                            { columnName: 'description', width: 130 },
                            { columnName: 'language', width: 130 },
                            { columnName: 'subjects', width: 130 },
                            { columnName: 'collections', width: 130 },
                            { columnName: 'keywords', width: 130 },
                            { columnName: 'active', width: 100 },
                        ]} />
                    <TableHeaderRow cellComponent={CustomTableHeaderCell} showSortingControls />
					<Toolbar rootComponent={ToolbarRoot} />
                    <TableFilterRow cellComponent={this.getFilterCellComponent}/>
                    <PagingPanel pageSizes={this.pageSizes} />
                </Grid>
                <Menu
                    id="all-files-menu"
                    anchorPosition={this.state.allFilesMenu.AnchorPos}
                    anchorReference={'anchorPosition'}
                    open={Boolean(this.state.allFilesMenu.AnchorPos)}
                    onClose={evt => { this.handleMenuClose(evt, 'allFilesMenu');}}
                >
                    <MenuItem
                        onClick={evt => {
                            this.editCallback(this.state.selectedFile);
                        }}
                    >
                        Edit this file
                    </MenuItem>
                    <MenuItem
                        onClick={evt => {
                            this.handleMenuClose(evt, 'allFilesMenu');
                            window.open(this.state.allFilesMenu.selectedFile.content_file, '_blank');
                        }}
                    >
                        View this file
                    </MenuItem>
                    <MenuItem
                        onClick={evt => {
                            this.handleMenuClose(evt, 'allFilesMenu');
                            this.confirmDeleteContent();
                        }}
                    >
                        Delete this file
                    </MenuItem>
                </Menu>
                <Dialog
                    open={this.state.confirmDelete}
                    onClose={() => this.closeDialog('confirmDelete')}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Confirm Delete?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this file {this.state.name}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.closeDialog('confirmDelete')} color="primary">
                            No
                        </Button>
                        <Button onClick={evt => {this.closeDialog('confirmDelete'); this.deleteFile(this.state.selectedFile);}} color="primary" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.contentDialogOpen}
                    onClose={() => this.setState({contentDialogOpen: true})}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Data for content file: {get(this.state.selectedFile, "name", "")}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <FileInfoEntry name="Description" property="description"/>
                            <FileInfoEntry
                                name="Creators"
                                property="creators"
                                displayFn={ids => ids.map(id => this.props.tagIdsTagsMap["creators"][id].name).join(", ")}
                                selectedFile={this.state.selectedFile}
                            />
                            <FileInfoEntry
                                name="Coverage"
                                property="coverage"
                                displayFn={id => this.props.tagIdsTagsMap["coverages"][id].name}
                                selectedFile={this.state.selectedFile}
                            />
                            <FileInfoEntry
                                name="Subjects"
                                property="subjects"
                                displayFn={ids => ids.map(id => this.props.tagIdsTagsMap["subjects"][id].name).join(", ")}
                                selectedFile={this.state.selectedFile}
                            />
                            <FileInfoEntry
                                name="Collections"
                                property="collections"
                                displayFn={ids => ids.map(id => this.props.tagIdsTagsMap["collections"][id].name).join(", ")}
                                selectedFile={this.state.selectedFile}
                            />
                            <FileInfoEntry
                                name="Keywords"
                                property="keywords"
                                displayFn={ids => ids.map(id => this.props.tagIdsTagsMap["keywords"][id].name).join(", ")}
                                selectedFile={this.state.selectedFile}
                            />
                            <FileInfoEntry
                                name="Workareas"
                                property="workareas"
                                displayFn={ids => ids.map(id => this.props.tagIdsTagsMap["workareas"][id].name).join(", ")}
                                selectedFile={this.state.selectedFile}
                            />
                            <FileInfoEntry
                                name="Language"
                                property="language"
                                displayFn={id => this.props.tagIdsTagsMap["languages"][id].name}
                                selectedFile={this.state.selectedFile}
                            />
                            <FileInfoEntry
                                name="Cataloger"
                                property="cataloger"
                                displayFn={id => this.props.tagIdsTagsMap["catalogers"][id].name}
                                selectedFile={this.state.selectedFile}
                            />
                            <FileInfoEntry name="Updated On" property="updated_time"/>
                            <FileInfoEntry
                                name="Active"
                                property="active"
                                displayFn={active => active == 1 ? <CheckCircleOutline /> : <HighlightOff />}
                                selectedFile={this.state.selectedFile}
                            />
                            <FileInfoEntry
                                name="Preview"
                                property="content_file"
                                displayFn={url => <a href={url} target="_blank">Click to preview file</a>}
                                selectedFile={this.state.selectedFile}
                            />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={evt => {this.setState({contentDialogOpen: false})}} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={Boolean(this.state.message)}
                    onClose={this.handleCloseSnackbar}
                    message={<span>{this.state.message}</span>}
                    ContentProps={{
                        "style": this.getErrorClass()
                    }}
                />
            </React.Fragment>
        );
    }
    /*
    * Error class
    */
    getErrorClass() {
        return this.state.messageType === "error" ? {backgroundColor: '#B71C1C', fontWeight: 'normal'} : {};
    }
    /*
    * Close snackbar
    */
    handleCloseSnackbar() {
        this.setState({
            message: null,
            messageType: 'info'
        })
    }
}
export default withStyles(styles)(FileListComponent);
