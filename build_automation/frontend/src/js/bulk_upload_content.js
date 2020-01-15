import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import {APP_URLS} from "./url";
import Snackbar from '@material-ui/core/Snackbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
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

/* const listItems = this.state.contentFileNames.map((item) =>
	<li>
	{item}
	</li>
); */

/*	This class handles the bulk uploading of content (files) to the solarSPELL
	manage content section. Using the class you can upload multiple files instead
	of uploading files one at a time per usual.

*/
class BulkUploadContent extends React.Component{
    constructor(props) {
        super(props);
		
		/* State contains an array of files, a string representation of filenames,
			and any errors.
	
		*/
        this.state = {
			contentFile: {},
            contentFileNames: [],
            fieldErrors: {},

        };
		
		this.tags = props.allTags;
        this.tagNameTagMap = this.buildTagNameTagMap(props.allTags);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
        this.handleDateChange=this.handleDateChange.bind(this);
        this.handleFileSelection=this.handleFileSelection.bind(this);
        this.saveContent=this.saveContent.bind(this);
        this.saveCallback=props.onSave.bind(this);
    }
	
	/*	TODO: Insert information about what this method does.
	
	*/
    buildTagNameTagMap(tags) {
        const tagNameTagMap = {};
		if(tags != null) {
			Object.keys(tags).forEach(eachTagType => {
				tagNameTagMap[eachTagType] = buildMapFromArray(tags[eachTagType], 'name');
			});
		}
        return tagNameTagMap;
    }
	
	/*	TODO: Insert information about what this method does.
	
	*/
	buildTagIdTagsMap(tags) {
        // Builds a map of <Tag Id> - Tag map for each tag type.
        const tagIdTagMap = {};
        Object.keys(tags).forEach(eachTagType => {
            tagIdTagMap[eachTagType] = buildMapFromArray(tags[eachTagType], 'id');
        });
        return tagIdTagMap;
    }
	
	/*	TODO: Insert information about what this method does.
	
	*/
	componentDidMount() {
        //this.loadData()
		//testing this method.
		/* console.log(prevProps.data);
		console.log(this.props.data);
		if(prevProps.data !== this.props.data) {
			this.setState({
            currentView: 'manage',
            files
			})
		} */
    }
	
	/*	This method is typically called by componentDidMount and is used to reload
		data if the component changed and needs updating.
	
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
	

	
	/*	This method takes in the current date/time and formats it
		into something that is readable and easy to store in the DB.
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
	
	
	/*	When this event is triggered based on a button click, this method is 
		called and sends the selected file(s) to the server via AXIOS and
		appends to DB table.
		
	*/
    saveContent(evt) {
		if (!this.is_valid_state(!(this.state.id > 0))) {
			console.log("invalid state bro!!!!: " + this.state.id);
			// If it is in an invalid state, do not proceed with the save operation.
            return;
        }
        var targetUrl = APP_URLS.CONTENTS_LIST;
		let promises = [];
		var response;
		//const payload = new FormData();
		//var currentDate = new Date();
		//this breaks everything currently.
		/* Array.from(this.state.contentFile).forEach(file => {
			console.log("calling method: " + file.name);
			
			const payload = new FormData();
			var currentDate = new Date();
			
			Boolean(file) && payload.append('content_file', file);
			payload.append('name', file.name);
			payload.append('description', "Please insert a description.");
			payload.append('updated_time', this.formatDate(currentDate));
			const currInstance = this;
			
			if (this.state.id > 0) {
				// Update an existing directory.
				payload.append('id', this.state.id);
				targetUrl = get_url(APP_URLS.CONTENT_DETAIL, {id:this.state.id});
				promises.push(axios.patch(targetUrl, payload, {
					responseType: 'json'
				}).then(function(response) {
					//currInstance.saveCallback(response.data, true);
					console.log("success in promise true");
				}).catch(function(error) {
					console.error("Error in updating the content", error);
					console.error(error.response.data);
					let errorMsg = 'Error in updating the content';
					currInstance.setState({
						message: errorMsg,
						messageType: 'error'
					});
				}));
			} else {
				// Create a new directory.
				payload.append('id', this.state.id);
				promises.push(axios.post(targetUrl, payload, {
					responseType: 'json'
				}).then(function(response) {
					// originally currInstance.saveCallback(response.data, false);
					
					response = response.data;
					//currInstance.saveCallback(response.data, false);
					console.log("response: " + JSON.stringify(response.data));
				}).catch(function(error) {
					console.error("Error in uploading the content", error);
					console.error(error.response.data);
					let errorMsg = 'Error in uploading the content';
					currInstance.setState({
						message: errorMsg,
						messageType: 'error'
					});
				}));
			}
			
		})
		
		Promise.all(promises).then(this.saveCallback(response, false)).catch(function(error) {
					console.error("Error in uploading the content", error);
					console.error(error.response.data);
					let errorMsg = 'Error in uploading the content';
					currInstance.setState({
						message: errorMsg,
						messageType: 'error'
					});
				});
		 */
		
		
		
		
		
		//this is the original method i was working with that somewhat works
		Array.from(this.state.contentFile).forEach(file => {
			console.log("calling method: " + file.name);
			const payload = new FormData();
			var currentDate = new Date();
			Boolean(file) && payload.append('content_file', file);
			payload.append('name', file.name);
			payload.append('description', "Please insert a description.");
			payload.append('updated_time', this.formatDate(currentDate));
			const currInstance = this;
			if (this.state.id > 0) {
				// Update an existing directory.
				payload.append('id', this.state.id);
				targetUrl = APP_URLS.CONTENT_DETAIL(this.state.id);
				axios.patch(targetUrl, payload, {
					responseType: 'json'
				}).then(function(response) {
					currInstance.saveCallback(response.data, true);
					console.log("success in promise true");
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
				payload.append('id', this.state.id);
				promises.push(axios.post(targetUrl, payload, {
					responseType: 'json'
				}).then(function(response) {
					// originally currInstance.saveCallback(response.data, false);
					currInstance.saveCallback(response.data, false);
					console.log("response: " + JSON.stringify(response.data));
				}).catch(function(error) {
					console.error("Error in uploading the content", error);
					console.error(error.response.data);
					let errorMsg = 'Error in uploading the content';
					currInstance.setState({
						message: errorMsg,
						messageType: 'error'
					});
				}));
			}
			
		});
		//Promise.all(promises).then(this.saveCallback(response.data, false));
    }
	
	/*	This method takes in a boolean value and checks if there are file names
		currently selected, if not it returns false. If there are any other
		errors, the method also returns false.
		
		Returns true if the state is valid.
	
	*/
	is_valid_state(is_save) {
        var hasErrors = false;
        const fieldErrors = {};
		console.log(this.state);
        
		if(!this.state.contentFileNames.length > 0) {
			hasErrors = true;
			fieldErrors['name'] = 'File names are required.';
		}
		
        if (hasErrors) {
            this.setState({fieldErrors});
        }
        return !hasErrors;
    }
	
	/*	This method sets the selected date of the current state.
	
	*/
	handleDateChange(date){
        this.setState({ selectedDate: date });
    };
	
	/*	This method adds the selected files to an array, and sets the state
		with the new information including: files, filenames, and errors from the
		previous state.
	
	*/
    handleFileSelection(evt) {
        evt.persist();
        const files = evt.target.files;
		var fileNames = [];

        console.log("files below");
		console.log(files);
		
		Array.from(files).forEach(file => fileNames.push(file.name));

        if (!Boolean(files)) { // If there is no file selected.
            return;
        }
        this.setState((prevState, props) => {
            const newState = {
                contentFile: files,
                contentFileNames: fileNames,
                fieldErrors: prevState.fieldErrors,
            };
			console.log(newState);
            newState.fieldErrors['files'] = null;
            return newState;
        });

     }
    /*
    * Render function for bulk upload
    */
    render(){
		//need to add components or hidden value fields with meta information as null
        return (
            <Grid item xs={8}>
                <AppBar position="static" style={{ height: '50px', margin: 'auto'}}>
                    <Typography gutterBottom variant="subtitle1" style={{color: '#ffffff', textAlign: 'center'}}>
                        Express Content Loading
                    </Typography>
                </AppBar>
                <div style={{marginTop: '20px'}}> </div>
                <h4 style={{color: '#75B2DD'}}>Selected Files</h4>
				<div style={{maxHeight: '50%', width: '100%'}}>
					<List style={{listStyleType: 'none', paddingLeft: '0', textIndent: '10px', overflow: 'auto', margin: '0', padding: '0', maxHeight: '50%', marginBottom: '25px'}} >
					  {this.state.contentFileNames.map(item => (
						<ListItem divider style={{lineHeight: '15px', background: '#b2dbfb'}} key={item}>{item}</ListItem>
						
					  ))}
					</List>
				</div>
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

                <div style={{marginTop: '20px'}}> </div>
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
    * Class to handle errors from this file
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

export default BulkUploadContent;
