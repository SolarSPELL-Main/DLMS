import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import AutoCompleteWithChips from './autocomplete.js';
import TextField from '@material-ui/core/TextField';
import {DatePicker} from '@material-ui/pickers';
import {APP_URLS} from "./url";
import Snackbar from '@material-ui/core/Snackbar';
import DateFnsUtils from "@date-io/date-fns"
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {ChevronLeft, ChevronRight} from '@material-ui/icons';
import axios from 'axios';
import {buildMapFromArray} from "./utils";
/*
* Default style for upload content
*/
const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
});

/*
* Upload content constructor
*/
class UploadContent extends React.Component{
    constructor(props) {
        super(props);
        this.tagIdsTagsMap = this.buildTagIdTagsMap(props.allTags);
        const labels = this.getAutoCompleteLabelsFromTagIds(props.content, this.tagIdsTagsMap);
        this.state = {
            id: props.content.id,
            name: props.content.name,
            description: props.content.description,
            creators: labels.creators,
            coverages: labels.coverages,
            subjects: labels.subjects,
            keywords: labels.keywords,
            workareas: labels.workareas,
            languages: labels.languages,
            catalogers: labels.catalogers,
            fieldErrors: {},
            selectedDate: props.content.updatedDate,
            source: props.content.source,
            copyright: props.content.copyright,
            rightsStatement: props.content.rightsStatement,
            contentFile: null,
            contentFileName: props.content.originalFileName ? props.content.originalFileName : '',
        };
        this.tags = props.allTags;
        this.tagNameTagMap = this.buildTagNameTagMap(props.allTags);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
        this.handleDateChange=this.handleDateChange.bind(this);
        this.handleTagAddition=this.handleTagAddition.bind(this);
        this.handleCreatorAddition=this.handleCreatorAddition.bind(this);
        this.handleCoverageAddition=this.handleCoverageAddition.bind(this);
        this.handleSubjectAddition=this.handleSubjectAddition.bind(this);
        this.handleKeywordAddition=this.handleKeywordAddition.bind(this);
        this.handleWorkareaAddition=this.handleWorkareaAddition.bind(this);
        this.handleLanguageAddition=this.handleLanguageAddition.bind(this);
        this.handleCatalogerAddition=this.handleCatalogerAddition.bind(this);
        this.handleTagDeletion=this.handleTagDeletion.bind(this);
        this.handleCreatorDeletion=this.handleCreatorDeletion.bind(this);
        this.handleCoverageDeletion=this.handleCoverageDeletion.bind(this);
        this.handleSubjectDeletion=this.handleSubjectDeletion.bind(this);
        this.handleKeywordDeletion=this.handleKeywordDeletion.bind(this);
        this.handleWorkareaDeletion=this.handleWorkareaDeletion.bind(this);
        this.handleLanguageDeletion=this.handleLanguageDeletion.bind(this);
        this.handleCatalogerDeletion=this.handleCatalogerDeletion.bind(this);
        this.handleFileSelection=this.handleFileSelection.bind(this);
        this.saveContent=this.saveContent.bind(this);
        this.saveTag=this.saveTag.bind(this);
        this.saveCallback=props.onSave.bind(this);
    }
    /*
    * Makes a tag map with tag IDs
    */
    buildTagIdTagsMap(tags) {
        // Builds a map of <Tag Id> - Tag map for each tag type.
        const tagIdTagMap = {};
        Object.keys(tags).forEach(eachTagType => {
            tagIdTagMap[eachTagType] = buildMapFromArray(tags[eachTagType], 'id');
        });
        return tagIdTagMap;
    }
    /*
    * Makes a tag map with tag names
    */
    buildTagNameTagMap(tags) {
        const tagNameTagMap = {};
        Object.keys(tags).forEach(eachTagType => {
            tagNameTagMap[eachTagType] = buildMapFromArray(tags[eachTagType], 'name');
        });
        return tagNameTagMap;
    }
    /*
    * Grab names from tags to give options for autocompletion
    */
    getAutoCompleteLabelsFromTagIds(boardInfo, tagIdsTagsMap) {
        const retval = {};
        Object.keys(tagIdsTagsMap).forEach(eachTagType => {
            const selectedTagsForDir = boardInfo[eachTagType];
            const selectedTypeAllTags = tagIdsTagsMap[eachTagType];
            const labels = [];
            selectedTagsForDir.forEach(eachTagId => {
                labels.push(selectedTypeAllTags[eachTagId].name);
            });
            retval[eachTagType] = labels;
        });
        return retval;
    }
    /*
    * Load all the data
    * loadData should be used(Will investigate later)
    */
    componentDidMount() {
        // this.loadData()
    }
    /*
    * Populate all the fields with data(grab stored data)
    */
    loadData() {
        const currInstance = this;
        axios.get(APP_URLS.TAG_LIST, {
            responseType: 'json'
        }).then(function (response) {
            currInstance.setState({
                tags: response.data
            })
        }).catch(function (error) {
            console.error(error);
            // TODO : Show the error message.
        });
    }
    /*
    * Handler for all text fields
    */
    handleTextFieldUpdate(stateProperty, evt) {
        const targetVal = evt.target.value;
        this.setState((prevState, props) => {
            const newState = {
                fieldErrors: prevState.fieldErrors,
                [stateProperty]: targetVal
            };
            newState.fieldErrors[stateProperty] = null;
            return newState;
        })
    }
    /*
    * Change the date data
    */
    handleDateChange(date){
        this.setState({ selectedDate: date });
    };
    /*
    * Handler for an addition to tags
    */
    handleTagAddition(tag, tagType){
        this.setState((prevState, props) => {
            const selectedTags = prevState[tagType];
            const fieldErrors = prevState.fieldErrors;
            selectedTags.push(tag.name);
            fieldErrors[tagType] = null;
            const value = {[tagType]: selectedTags, fieldErrors};
            return value;
        })
    }
    /*
    * Handler for a deletion in tags
    */
    handleTagDeletion(tag, tagType){
        this.setState((prevState, props) => {
            const selectedTags = prevState[tagType];
            selectedTags.splice(selectedTags.indexOf(tag.name), 1);
            const value = {[tagType]: selectedTags};
            return value;
        })
    }
    /*
    * Handle additions to all fields
    */
    handleCreatorAddition(creator){
        this.handleTagAddition(creator, 'creators')
    }
    handleCoverageAddition(coverage){
        this.handleTagAddition(coverage, 'coverages')
    }
    handleSubjectAddition(subject){
        this.handleTagAddition(subject, 'subjects')
    }
    handleKeywordAddition(keyword){
        this.handleTagAddition(keyword, 'keywords')
    }
    handleWorkareaAddition(workarea){
        this.handleTagAddition(workarea, 'workareas')
    }
    handleLanguageAddition(language){
        this.handleTagAddition(language, 'languages')
    }
    handleCatalogerAddition(cataloger){
        this.handleTagAddition(cataloger, 'catalogers')
    }
    /*
    * Handle deletion for all the fields
    */
    handleCreatorDeletion(creator){
        this.handleTagDeletion(creator, 'creators')
    }
    handleCoverageDeletion(coverage){
        this.handleTagDeletion(coverage, 'coverages')
    }
    handleSubjectDeletion(subject){
        this.handleTagDeletion(subject, 'subjects')
    }
    handleKeywordDeletion(keyword){
        this.handleTagDeletion(keyword, 'keywords')
    }
    handleWorkareaDeletion(workarea){
        this.handleTagDeletion(workarea, 'workareas')
    }
    handleLanguageDeletion(language){
        this.handleTagDeletion(language, 'languages')
    }
    handleCatalogerDeletion(cataloger){
        this.handleTagDeletion(cataloger, 'catalogers')
    }
    /*
    * Check for vaild state
    */
    is_valid_state(is_save) {
        var hasErrors = false;
        const fieldErrors = {};
        if (!this.state.name || this.state.name.trim().length === 0) {
            hasErrors = true;
            fieldErrors['name'] = 'Name is required.';
        }
        if (!this.state.description || this.state.description.trim().length === 0) {
            hasErrors = true;
            fieldErrors['description'] = 'Description is required.';
        }
        if (hasErrors) {
            this.setState({fieldErrors});
        }
        return !hasErrors;
    }
    /*
    * Get tags from the tags map
    */
    getSelectedTags() {
        const tagTypeSelectedTagsMap = {};
        Object.keys(this.props.allTags).forEach(eachTagType => {
            tagTypeSelectedTagsMap[eachTagType] = this.getSelectedTagsIdsFromName(eachTagType);
        });
        return tagTypeSelectedTagsMap;
    }
    /*
    * Match a tag based off of name and get its ID
    */
    getSelectedTagsIdsFromName(tagType) {
        const matchingTagIds = [];
        this.state[tagType].forEach(eachLabel => {
            matchingTagIds.push(this.tagNameTagMap[tagType][eachLabel].id);
        });
        return matchingTagIds;
    }
    /*
    * Format the date accordingly
    */
    formatDate(input) {
        const year = input.getFullYear();
        let month = input.getMonth()+1;
        if (month < 10) {
            month = '0' + month;
        }
        let date = input.getDate();
        if (date < 10) {
            date = '0' + date;
        }
        return year + '-' + month + '-' + date;
    }
    /*
    * Save the content whether it be an edit or new upload
    */
    saveContent(evt) {
        if (!this.is_valid_state(!(this.state.id > 0))) {
            // If it is in an invalid state, do not proceed with the save operation.
            return;
        }
        var targetUrl = APP_URLS.CONTENTS_LIST;
        const selectedTags = this.getSelectedTags();
        const payload = new FormData();
        payload.append('name', this.state.name);
        payload.append('description', this.state.description);
        selectedTags.creators.forEach(creator => {payload.append('creators', creator)});
        selectedTags.coverages.length>0 && payload.append('coverage', selectedTags.coverages[0]);
        selectedTags.subjects.forEach(subject => {payload.append('subjects', subject)});
        selectedTags.keywords.forEach(keyword => {payload.append('keywords', keyword)});
        selectedTags.workareas.forEach(workarea => {payload.append('workareas', workarea)});
        selectedTags.languages.length>0 && payload.append('language', selectedTags.languages[0]);
        selectedTags.catalogers.length>0 && payload.append('cataloger', selectedTags.catalogers[0]);
        payload.append('updated_time', this.formatDate(this.state.selectedDate));
        Boolean(this.state.contentFile) && payload.append('content_file', this.state.contentFile);
        Boolean(this.state.source) && payload.append('source', this.state.source);
        Boolean(this.state.copyright) && payload.append('copyright', this.state.copyright);
        Boolean(this.state.rightsStatement) && payload.append('rights_statement', this.state.rightsStatement);
        const currInstance = this;
        if (this.state.id > 0) {
            // Update an existing directory.
            payload.append('id', this.state.id);
            targetUrl = APP_URLS.CONTENT_DETAIL(this.state.id);
            axios.patch(targetUrl, payload, {
                responseType: 'json'
            }).then(function(response) {
                currInstance.saveCallback(response.data, true);
            }).catch(function(error) {
                console.error("Error in updating the content", error);
                console.error(error.response.data);
                let errorMsg = 'Error in updating the content';
                currInstance.setState({
                    message: errorMsg,
                    messageType: 'error'
                });
            });
        } else {
            // Create a new directory.
            axios.post(targetUrl, payload, {
                responseType: 'json'
            }).then(function(response) {
                currInstance.saveCallback(response.data, false);
            }).catch(function(error) {
                console.error("Error in uploading the content", error);
                console.error(error.response.data);
                let errorMsg = 'Error in uploading the content';
                currInstance.setState({
                    message: errorMsg,
                    messageType: 'error'
                });
            });
        }
    }
    /*
    * Method for selecting a file from the file screen
    */
    handleFileSelection(evt) {
        evt.persist();
        const file = evt.target.files[0];
        if (!Boolean(file)) { // If there is no file selected.
            return;
        }
        this.setState((prevState, props) => {
            const newState = {
                contentFile: file,
                contentFileName: file.name,
                fieldErrors: prevState.fieldErrors,
            };
            newState.fieldErrors['file'] = null;
            return newState;
        });
    }
    /*
    * Save new tag made by hte upload process
    */
    saveTag(tagName, url, tagType){
        const payload = {name: tagName, description: tagName};
        const currentInstance = this;
        axios.post(url, payload, {responseType: 'json'}).then(function(response) {
            currentInstance.tags[tagType].push(response.data);
            currentInstance.tagIdsTagsMap[tagType][response.data.id] = response.data;
            currentInstance.tagNameTagMap[tagType][response.data.name] = response.data;
            currentInstance.setState((prevState, props) => {
                const newState = {
                    [tagType]: prevState[tagType],
                    message: 'Metadata created',
                    messageType: 'info',
                };
                newState[tagType].push(tagName);
                return newState;
            })
        }).catch(function(error) {
            console.error("Error in creating a new directory", error);
            console.error(error.response.data);
            let errorMsg = 'Error in creating the folder';
            if (!(JSON.stringify(error.response.data).indexOf('DUPLICATE_DIRECTORY') === -1)) {
                errorMsg = (<React.Fragment><b>ERROR:</b> There is another folder under the same name within the current folder. Please change the name, and try again.</React.Fragment>);
            }
            currInstance.setState({
                message: errorMsg,
                messageType: 'error'
            });
        });
    }
    /*
    * Render function for upload page
    */
    render(){
        return (
            <Grid item xs={8}>
                <AppBar position="static" style={{ height: '50px', margin: 'auto'}}>
                    <Typography gutterBottom variant="subtitle1" style={{color: '#ffffff'}}>

                    </Typography>
                </AppBar>
                <div style={{marginTop: '20px'}}> </div>
                <TextField
                    id="contentFile"
                    label="Content File"
                    multiline
                    disabled
                    InputLabelProps={{
                        shrink: true,
                    }}
                    error={this.state.fieldErrors.file ? true : false}
                    value={this.state.contentFileName}
                    margin="normal"
                />
                <input
                    accept="*"
                    className={'hidden'}
                    id="upload-file"
                    multiple
                    type="file"
                    ref={input => {this.fileInput = input;}}
                    onChange={this.handleFileSelection}
                />
                <label htmlFor="upload-file">
                    <Button variant="contained" component="span">
                        Browse
                    </Button>
                </label>
                <TextField
                    id="name"
                    label="Name *"
                    value={this.state.name}
                    error={this.state.fieldErrors.name ? true : false}
                    onChange={evt => this.handleTextFieldUpdate('name', evt)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    id="description"
                    label="Description *"
                    multiline
                    fullWidth
                    error={this.state.fieldErrors.description ? true : false}
                    value={this.state.description}
                    onChange={evt => this.handleTextFieldUpdate('description', evt)}
                    margin="normal"
                />
                <div style={{marginTop: '20px'}}> </div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        id="updated_date"
                        label="Last Updated:"
                        value={this.state.selectedDate}
                        onChange={this.handleDateChange}
                        leftArrowIcon={<ChevronLeft/>}
                        rightArrowIcon={<ChevronRight/>}
                    />
                </MuiPickersUtilsProvider>
                <div style={{marginTop: '20px'}}> </div>
                <Typography gutterBottom variant="subtitle1">
                    Creator(s)
                </Typography>
                <span>
                            <AutoCompleteWithChips onAddNew={tag => this.saveTag(tag, APP_URLS.CREATORS_LIST, 'creators')} suggestions={this.props.allTags['creators']}
                                                   searchKey={'name'} selectedItem={this.state.creators}
                                                   onAddition={this.handleCreatorAddition} onDeletion={this.handleCreatorDeletion}/>
                        </span>
                <div style={{marginTop: '20px'}}> </div>
                <Typography gutterBottom variant="subtitle1">
                    Coverage
                </Typography>
                <span>
                            <AutoCompleteWithChips maxChips={1} suggestions={this.props.allTags['coverages']}
                                                   searchKey={'name'} selectedItem={this.state.coverages}
                                                   onAddition={this.handleCoverageAddition} onDeletion={this.handleCoverageDeletion}/>
                        </span>
                <div style={{marginTop: '20px'}}> </div>
                <Typography gutterBottom variant="subtitle1">
                    Subject(s)
                </Typography>
                <span>
                            <AutoCompleteWithChips suggestions={this.props.allTags['subjects']}
                                                   searchKey={'name'} selectedItem={this.state.subjects}
                                                   onAddition={this.handleSubjectAddition} onDeletion={this.handleSubjectDeletion}/>
                        </span>
                <div style={{marginTop: '20px'}}> </div>
                <Typography gutterBottom variant="subtitle1">
                    Keywords
                </Typography>
                <span>
                            <AutoCompleteWithChips onAddNew={tag => this.saveTag(tag, APP_URLS.KEYWORDS_LIST, 'keywords')} suggestions={this.props.allTags['keywords']}
                                                   searchKey={'name'} selectedItem={this.state.keywords}
                                                   onAddition={this.handleKeywordAddition} onDeletion={this.handleKeywordDeletion}/>
                        </span>
                <div style={{marginTop: '20px'}}> </div>
                <Typography gutterBottom variant="subtitle1">
                    Work Area(s)
                </Typography>
                <span>
                            <AutoCompleteWithChips suggestions={this.props.allTags['workareas']}
                                                   searchKey={'name'} selectedItem={this.state.workareas}
                                                   onAddition={this.handleWorkareaAddition} onDeletion={this.handleWorkareaDeletion}/>
                        </span>
                <div style={{marginTop: '20px'}}> </div>
                <Typography gutterBottom variant="subtitle1">
                    Language
                </Typography>
                <span>
                            <AutoCompleteWithChips maxChips={1} suggestions={this.props.allTags['languages']}
                                                   searchKey={'name'} selectedItem={this.state.languages}
                                                   onAddition={this.handleLanguageAddition} onDeletion={this.handleLanguageDeletion}/>
                        </span>
                <div style={{marginTop: '20px'}}> </div>
                <Typography gutterBottom variant="subtitle1">
                    Cataloger
                </Typography>
                <span>
                            <AutoCompleteWithChips maxChips={1} suggestions={this.props.allTags['catalogers']} searchKey={'name'}
                                                   selectedItem={this.state.catalogers}
                                                   onAddition={this.handleCatalogerAddition} onDeletion={this.handleCatalogerDeletion}/>
                        </span>
                <TextField
                    id="source"
                    label="Source *"
                    value={this.state.source}
                    error={this.state.fieldErrors.source ? true : false}
                    onChange={evt => this.handleTextFieldUpdate('source', evt)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    id="copyright"
                    label="Copyright *"
                    value={this.state.copyright}
                    error={this.state.fieldErrors.copyright ? true : false}
                    onChange={evt => this.handleTextFieldUpdate('copyright', evt)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    id="rightsStatement"
                    label="Rights Statement *"
                    value={this.state.rightsStatement}
                    error={this.state.fieldErrors.rightsStatement ? true : false}
                    onChange={evt => this.handleTextFieldUpdate('rightsStatement', evt)}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" component="span" onClick={this.saveContent}>
                    Save
                </Button>

                <div style={{marginTop: '20px'}}> </div>
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
            </Grid>
        )
    }
    /*
    * Method for error handling
    */
    getErrorClass() {
        return this.state.messageType === "error" ? {backgroundColor: '#B71C1C', fontWeight: 'normal'} : {};
    }
    /*
    * Close snackbar method
    */
    handleCloseSnackbar() {
        this.setState({
            message: null,
            messageType: 'info'
        })
    }
}
export default UploadContent;
