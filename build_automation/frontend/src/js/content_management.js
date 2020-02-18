import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import UploadContent from './upload_content';
import Snackbar from '@material-ui/core/Snackbar';
import BulkUploadContent from './bulk_upload_content';
import BulkMetadataUpload from './bulk_metadata_upload';
import FileListComponent from './file_list_component';
import {buildMapFromArray} from './utils';
import {DownloadExcelButton} from "./download_excel"
import {APP_URLS, FILTER_PARAMS, get_pagination_query, get_filter_query} from "./url";
import axios from 'axios';

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
* Constructor for Content Management
*/
class ContentManagement extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            fieldErrors: {},
            updatedTime: '',
            files: [],
            currentView: 'manage',
            content: null,
            tags: {},
            isLoaded: false,
            shouldRefresh: false,
            totalCount: 0,
            page_id: 1,
            page_size: 10,
            filters: []
        };
        this.defaultLoadParams = [1, 10, []]

        this.setCurrentView = this.setCurrentView.bind(this);
        this.tagIdTagsMap = {};
        this.handleFileDelete = this.handleFileDelete.bind(this);
        this.saveContentCallback = this.saveContentCallback.bind(this);
		this.saveContentCallbackTwo = this.saveContentCallbackTwo.bind(this);
        this.saveMetadataCallback = this.saveMetadataCallback.bind(this);
        this.uploadNewFile = this.uploadNewFile.bind(this);
        this.uploadBulkMetadata = this.uploadBulkMetadata.bind(this);
        this.handleContentEdit = this.handleContentEdit.bind(this);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
        this.loadDataByPage = this.loadDataByPage.bind(this);
    }

    componentDidMount() {
        this.loadDataByPage(...this.defaultLoadParams)
    }

    buildTagIdTagsMap(tags) {
        // Builds a map of <Tag Id> - Tag
        const tagIdTagMap = {};
        Object.keys(tags).forEach(eachKey => {
            tagIdTagMap[eachKey] = buildMapFromArray(tags[eachKey], 'id');
        });
        return tagIdTagMap;
    }
    /*
    * Get all uploaded content
    */
    loadDataByPage(page_id, page_size, filters) {
        const currInstance = this;
        const allRequests = [];
        allRequests.push(axios.get(APP_URLS.ALLTAGS_LIST, {responseType: 'json'}).then(function(response) {
            currInstance.tagIdTagsMap=currInstance.buildTagIdTagsMap(response.data);
            return response;
        }));
        allRequests.push(axios.get(APP_URLS.CONTENTS_LIST + get_pagination_query(page_id, page_size) + "&" + get_filter_query(filters, FILTER_PARAMS.CONTENTS), {responseType: 'json'}));
        Promise.all(allRequests).then(function(values) {
            currInstance.setState({
                tags: values[0].data,
                files: Object.values(values[1].data.results),
                totalCount: values[1].data.count,
                isLoaded: true
            })
        }).catch(function(error) {
            console.error(error);
        });

        this.setState({page_id, page_size, filters})
    }
    /*
    * Process updates to text fields
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
    * Current view(current window)
    */
    setCurrentView(viewName){
        this.setState({currentView: viewName})
    }
    /*
    * Delete content
    */
    handleFileDelete(file){
        this.setState((prevState, props)=>{
            const {files} = prevState;
            files.forEach(eachFile => {
                if (eachFile.id===file.id){
                    files.splice(files.indexOf(eachFile), 1)
                }
            });
            return {files, message: 'Delete Successful', messageType: 'info',};
        })
    }
    /*
    * Save content
    */
    saveContentCallback(content, updated){
		console.log("save callback in CM.js");
        const currInstance = this;
        axios.get(APP_URLS.ALLTAGS_LIST, {
            responseType: 'json'
        }).then(function (response) {
            currInstance.tagIdTagsMap=currInstance.buildTagIdTagsMap(response.data);
            currInstance.setState((prevState, props)=>{
                const {files} = prevState;
                if (updated){
                    files.forEach(eachFile => {
                        if (eachFile.id===content.id){
                            files.splice(files.indexOf(eachFile), 1, content);
                        }
                    });
					console.log("updated true");
                }
                else{
					console.log("updated false");
                    files.push(content);
                }
				console.log(files);
                return {
                    message: 'Save Successful',
                    messageType: 'info',
                    currentView: 'manage',
                    files,
                    tags: response.data
                }
            })
        }).catch(function (error) {
            console.error(error);
        });
    }
    /*
    * Should the page refresh?
    */
	componentDidUpdate(prevProps, prevState) {
		//console.log("prev props:");
		//console.log(prevProps);
		//console.log("currentState");
		if(this.state.shouldRefresh) {
			console.log(this.state);
			this.loadDataByPage(...this.defaultLoadParams);
			this.setState({shouldRefresh: false});
		}
	}
	
	saveContentCallbackTwo(content, updated){
		console.log("save callback in CM2.js");
        const currInstance = this;
        axios.get(APP_URLS.ALLTAGS_LIST, {
            responseType: 'json'
        }).then(function (response) {
			
            currInstance.tagIdTagsMap=currInstance.buildTagIdTagsMap(response.data);
            currInstance.setState((prevState, props)=>{
                const {files} = prevState;
                if (updated){
                    files.forEach(eachFile => {
                        if (eachFile.id===content.id){
                            files.splice(files.indexOf(eachFile), 1, content);
                        }
                    });
					
                }
                else{
					//console.log(files);
                    files.push(content);
					console.log(files);
					currInstance.setState({shouldRefresh: true});
					if(currInstance.state.isLoaded) {
						currInstance.setState();
					}
                }
				
				console.log("props: " + JSON.stringify(props));
                return {
                    message: 'Save Successful',
                    messageType: 'info',
                    currentView: 'manage',
                    content: files,
                    tags: response.data
                }
            })
        }).catch(function (error) {
            console.error(error);
        });
    }
    
    saveMetadataCallback(content, updated) {

        const currInstance = this;
        
        
        axios.get(APP_URLS.CONTENTS_LIST + get_pagination_query(this.state.page_id, this.state.page_size), {
            responseType: 'json'
        }).then(function (response) {
            currInstance.content = response.data;
            currInstance.setState((prevState, props)=>{
                const {files} = prevState; 
                if (updated){
                    files.forEach(eachFile => {
                        if (eachFile.id===content.id){
                            files.splice(files.indexOf(eachFile), 1, content);
                        }
                    });
                }
                currInstance.forceUpdate();
                return {
                    message: 'Metadata File Save Successful',
                    messageType: 'info',
                    currentView: 'manage',
                    
                }
            })
        }).catch(function (error) {
            console.error(error);
        });
        
    }
    
    /*
    Basic upload screen
    */

    uploadNewFile(){
        this.setState({
            currentView: 'upload',
            content: {
                id: -1,
                name: "",
                description: "",
                creators: [],
                subjects: [],
                keywords: [],
                languages: [],
                audiences: [],
                resourcetypes: [],
                catalogers: [],
                collections: [],
                updatedDate: new Date(),
                publishedDate: new Date(),
                source: "",
                copyright: "",
                rightsStatement: "",
                originalFileName: ""
            }
        })
    }
    /*
    Upload screen for bulk upload
    */
    uploadBulkFiles() {
        this.setState({
            currentView: 'bulkUploadContent',
			content: {
                id: -1,
                name: "",
                description: "",
                creators: [],
                subjects: [],
                keywords: [],
                languages: [],
                audiences: [],
                resourcetypes: [],
                catalogers: [],
                collections: [],
                updatedDate: new Date(),
                publishedDate: new Date(),
                source: "",
                copyright: "",
                rightsStatement: "",
                originalFileName: ""
            }
        })
    }

       uploadBulkMetadata() {
        this.setState({
            currentView: 'bulkMetadataUpload',
			content: {
                id: -1,
                name: "",
                description: "",
                creators: [],
                subjects: [],
                keywords: [],
                languages: [],
                audiences: [],
                resourcetypes: [],
                catalogers: [],
                collections: [],
                updatedDate: new Date(),
                publishedDate: new Date(),
                source: "",
                copyright: "",
                rightsStatement: "",
                originalFileName: ""
            }
        })
    }

    /*
    Screen for editing already uploaded content
    */

    handleContentEdit(content){
        this.setState({
            currentView: 'upload',
            content: {
                id: content.id,
                name: content.name,
                description: content.description,
                creators: content.creators||[],
                subjects: content.subjects||[],
                collections: content.collections||[],
                keywords: content.keywords||[],
                languages: content.language?[content.language]:[],
                audiences: content.audience?[content.audience]:[],
                resourcetypes: content.resourcetype?[content.resourcetypes]:[],
                catalogers: content.cataloger?[content.cataloger]:[],
                updatedDate: this.parseDate(content.updated_time),
                publishedDate: this.parseDate(content.published_date),
                source: content.source||'',
                copyright: content.copyright||'',
                rightsStatement: content.rights_statement||'',
                originalFileName: content.original_file_name,
            }
        })
    }
    /*
    * Function to parse dates
    */
    parseDate(inputStr) {
        if (!inputStr) return null
        let splitval = inputStr.split("-");
        return new Date(splitval[0], splitval[1] - 1, splitval[2]);
    }
    /*
    Main screen for content management
    */
    render(){
        return (
            <div>
			<Grid container style={{justifyContent: 'center', marginBottom: '25px', paddingLeft: '20px'}}>
					<Grid item xs>
					</Grid>
					<Grid item xs>
					</Grid>
					<Grid item xs>
					</Grid>
					<Grid item xs>
					</Grid>
                    <Grid item xs>
                        <Button variant="contained" color="primary" style={{width: '160px'}} onClick={e => {this.setCurrentView('manage')}}>
                            Manage Content
                        </Button>
					</Grid>
					
					<Grid item xs>
                        <Button variant="contained" color="primary" style={{width: '160px'}} onClick={e => {this.uploadNewFile()}}>
                            Add Content
                        </Button>
					</Grid>
					<Grid item xs>
                        <Button variant="contained" color="primary" style={{width: '160px'}} onClick={e => {this.uploadBulkFiles()}}>
                            Express Load
                        </Button>
                        
                        
                    </Grid>
					<Grid item xs>
                        <Button variant="contained" color="primary" style={{width: '160px'}} onClick={e => {this.uploadBulkMetadata()}}>
                            Metadata Load
                        </Button>
					</Grid>
					<Grid item xs>
					</Grid>
					<Grid item xs>
					</Grid>
					<Grid item xs>
					</Grid>
				</Grid>
                <Grid container spacing={0} style={{paddingLeft: '20px', paddingRight: '20px'}}>
                    

                    <Grid item xs={12}>
                        {this.state.isLoaded && this.state.currentView=='manage' && <>
                            <FileListComponent
                                tags={this.state.tags}
                                onEdit={this.handleContentEdit}
                                onDelete={this.handleFileDelete}
                                allFiles={this.state.files}
                                tagIdsTagsMap={this.tagIdTagsMap}
                                getFiles={this.loadDataByPage}
                                totalCount={this.state.totalCount}
                            />
                            <DownloadExcelButton
                                filters={this.state.filters}
                                filter_params={FILTER_PARAMS.CONTENTS}
                            />
                        </>}
                        {this.state.isLoaded && this.state.currentView=='upload'&&<UploadContent onSave={this.saveContentCallback}
                                                                                                 tagIdsTagsMap={this.tagIdTagsMap} allTags={this.state.tags}
                                                                                                 content={this.state.content}/>}

                        {this.state.isLoaded && this.state.currentView === 'bulkUploadContent' && <BulkUploadContent onSave={this.saveContentCallbackTwo} 
						content={this.state.content} />}
                        
                        {this.state.isLoaded && this.state.currentView === 'bulkMetadataUpload' && <BulkMetadataUpload onSave={this.saveContentCallback}
                                                                                                 tagIdsTagsMap={this.tagIdTagsMap} allTags={this.state.tags}
						content={this.state.content} saveCallback={this.saveContentCallback} />}
						
                        {!this.state.isLoaded && 'loading'}
                    </Grid>
                </Grid>
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
            </div>
        )
    }
    /*
    * Error class
    */
    getErrorClass() {
        return this.state.messageType === "error" ? {backgroundColor: '#B71C1C', fontWeight: 'normal'} : {};
    }
    /*
    * Close Snackbar
    */
    handleCloseSnackbar() {
        this.setState({
            message: null,
            messageType: 'info'
        })
    }
}
export default ContentManagement;
