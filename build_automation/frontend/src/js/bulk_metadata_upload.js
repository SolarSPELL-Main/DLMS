import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {creatMuiTheme} from '@material-ui/core/styles';
import {APP_URLS} from "./url";
import axios from 'axios';
import Papa from 'papaparse';

const style = theme => ({
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
    
});

class BulkMetadataUpload extends React.Component {	    
		constructor(props) {
            super(props);
            console.log("props:\n");
            console.log(props);
            this.state = {
           
            id: "",
            name: "", 
            selectedDate: null,
            fieldErrors: {},
            metadataFile: null,
            metadataFileName: "",
            data:[] ,
            //Below is the state of the upload content module; use this to adjust the metadata updates
            description: "",
            creators: props.content.creators,
            coverages: props.content.coverages,
            subjects: props.content.subjects,
            keywords: props.content.keywords,
            workareas: props.content.workareas,
            languages: props.content.languages,
            catalogers: props.content.catalogers,
            collections: props.content.collections,
            //fieldErrors: {},
            selectedDate: props.content.updatedDate,
            source: props.content.source,
            copyright: props.content.copyright,
            rightsStatement: props.content.rightsStatement,
            //contentFile: null,
            //contentFileName: props.content.originalFileName ? props.content.originalFileName : '',//*/
        };
            this.handleFileSelection = this.handleFileSelection.bind(this);
            this.saveMetadata = this.saveMetadata.bind(this); 
            this.saveMetadataCallback = props.onSave.bind(this);
            this.saveCallback = props.saveCallback.bind(this);
        }
        
        handleFileSelection(evt) {
            var data;
            evt.persist();
            const file = evt.target.files[0];
            if (!Boolean(file)) { // If there is no file selected.
                return;
            }
            
            
            this.setState((prevState, props) => {
                const newState = {
                    metadataFile: file,
                    metadataFileName: file.name,
                    fieldErrors: prevState.fieldErrors,                   
                };
               
                return newState;
            });
            
        }
        
        formatDate(input) {
            //this is something that needs to be fixed, i hardcoded a date....
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
        
        saveMetadata() {
            //console.dir("State: " + JSON.stringify(this.state));
            console.log(this.props);
            var parsed;
            const currInstance = this;
            var currentInstance = this;
            var matchedRecords = 0;
            var unmatchedRecords = 0; 
            var unmatchedArray = [];
            var matchedArray = [];

            Papa.parse(this.state.metadataFile, {
                header:true,
                delimiter:",",
                complete:function(results) {
                    
                    parsed = results.data;
                    
                    
                    axios.get(APP_URLS.CONTENTS_LIST, {
                        responseType: 'json'
                    }).then(function (response) {
                        currInstance.content = response.data;
                        console.log("currant content");
                        console.log(currInstance.content);
                        console.log("Parse:");
                        console.log(parsed);
                        
                        for(var i = 0; i < parsed.length;i++) {
                            for (var j = 0; j < currInstance.content.length; j++) {
                                if(parsed[i]["File Name"] == currInstance.content[j].original_file_name) {
                                    console.log(currInstance.content[j].original_file_name + " exists");
                                    matchedRecords++;
                                    
                                    
                                    const payload = new FormData();
                                    payload.append('name', parsed[i]["Title"]);
                                    if (parsed[i]["Description"] == "")
                                        payload.append('description', "No Description in Spreadsheet");
                                    else
                                        payload.append('description', parsed[i]["Description"]);
                               
                                  
                     
                                   for (var x = 0; x < currInstance.props.allTags.languages.length; x++){
                                      if (parsed[i]["Language"] == currInstance.props.allTags.languages[x].name) {
                                          
                                      payload.append('language', currInstance.props.allTags.languages[x].id);
                                      //currInstance.props.allTags.languages[x].name;
                                     
                                      }
                                         
                                   }
                                   
                                    for (var x = 0; x < currInstance.props.allTags.subjects.length; x++){
                                      if (parsed[i]["Subject"] == currInstance.props.allTags.subjects[x].name) {
                                          
                                      payload.append('subjects', currInstance.props.allTags.subjects[x].id);
                                      
                                      }
                                   }
                                   
                                    for (var x = 0; x < currInstance.props.allTags.coverages.length; x++){
                                      if (parsed[i]["Coverage (Spatial)"] == currInstance.props.allTags.coverages[x].name) {
                                          
                                      payload.append('coverage', currInstance.props.allTags.coverages[x].id);
                                      
                                      }
                                   }
                                   
                                    for (var x = 0; x < currInstance.props.allTags.catalogers.length; x++){
                                      if (parsed[i]["Cataloger"] == currInstance.props.allTags.catalogers[x].name) {
                                          
                                      payload.append('cataloger', currInstance.props.allTags.catalogers[x].id);
                                      
                                      }
                                   }
                                   
                                    for (var x = 0; x < currInstance.props.allTags.creators.length; x++){
                                      if (parsed[i]["Creator"] == currInstance.props.allTags.creators[x].name) {
                                      console.log("creator: " + currInstance.props.allTags.creators[x].name);
                                      payload.append('creators', currInstance.props.allTags.creators[x].id);
                                      
                                      }
                                   }
                                    for (var x = 0; x < currInstance.props.allTags.collections; x++){
                                        if (parsed[i]["Collection"] == currInstance.props.allTags.collections[x].name) {
                                        console.log("collection: " + currInstance.props.allTags.collections[x].name);
                                        payload.append('collection', currInstance.props.allTags.collections[x].id);
                                        
                                        }
                                    }
                                    ////payload.append('subjects', parsed[i]["Subject"]);
                                    //payload.append('language', currInstance.props.language);
                                    //payload.append('cataloger', parsed[i]["Cataloger"]);
                                    //payload.append('updated_time', formatDate(this.state.selectedDate));
                                    //payload.append('content_file', currInstance.content[j].content_file);
                                    //payload.append('source', parsed[i]["Source"]);
                                    payload.append('copyright', parsed[i]["License/Copyright"]);
                                    payload.append('rights_statement', parsed[i]["Rights Statement"]);
                                    //const currInstance = this;
                                    //if (this.state.id > 0) {
                                        // Update an existing directory.
                                        payload.append('id', currInstance.content[j].id);
                                        targetUrl = APP_URLS.CONTENT_DETAIL(currInstance.content[j].id);
                                        axios.patch(targetUrl, payload, {
                                            responseType: 'json'
                                        }).then(function(response) {
                                            currInstance.saveMetadataCallback(response.data, true);
                                        }).catch(function(error) {
                                            console.error("Error in updating the content", error);
                                            console.error(error.response.data);
                                            let errorMsg = 'Error in updating the content';
                                            currInstance.setState({
                                                message: errorMsg,
                                                messageType: 'error'
                                            });
                                        });
                                    //}
                                    //////////////////////SaveFromUploadContent
                                    if(matchedArray.indexOf(parsed[i]["File Name"]) == -1)
                                        matchedArray.push(parsed[i]["File Name"]);
                                }
                                                           
     
                            }             
                        }
                        
                        console.log("props in parse callback");
                                    console.log(currInstance.props);
                        
                        console.log("Matched " + matchedRecords + " records:");
                        console.log(matchedArray);
                        
                    }).catch(function (error) {
                        console.error(error);
                    });
                }
            });
            
            const payload = new FormData();
     
            Boolean(this.state.metadataFile) && payload.append('metadata_file', this.state.metadataFile);
            payload.append('name', this.state.metadataFileName)
            
            
                axios.post(APP_URLS.METADATA_UPLOAD, payload, {
                responseType: 'json'
            }).then(function(response) {
                currInstance.saveMetadataCallback(response.data, true);
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
        
        
        
		render(){
				return (
                            <Grid item xs = {8}>
                                
                                <AppBar position="static" style={{ height: '50px', margin: 'auto'}}>
                                    <Typography gutterBottom variant="subtitle1" style={{color: '#ffffff', textAlign: 'center'}}>
                                        Metadata Loading
                                    </Typography>
                                </AppBar>
                                <div style={{marginTop: '20px'}}> </div>
                                
                                <h4 style={{color: '#75B2DD'}}>Selected Files</h4>
                                
                                <div style={{maxHeight: '50%', width: '100%'}}>
                                    <List style={{listStyleType: 'none', paddingLeft: '0', textIndent: '10px', overflow: 'auto', margin: '0', padding: '0', maxHeight: '50%', marginBottom: '25px'}} >    
                                     
                                    
                                     <ListItem divider style={{lineHeight: '15px', background: '#b2dbfb' }} key={this.state.metadataFileName}>{this.state.metadataFileName}</ListItem>
                                    </List>
                                </div>
                                
                                <input 
                                accept=".csv"
                                className={"hidden"}
                                id="metadata-upload-input"
                                multiple
                                type="file" 
                                ref={input => {this.fileInput = input;}} 
                                onChange={this.handleFileSelection}
                                />

                                <label htmlFor="metadata-upload-input">
                                    <Button variant="contained" component="span">
                                        Browse
                                    </Button>
                                </label>
                                
                                <div style={{marginTop: '20px'}}> </div>
                                
                                <Button variant="contained" component="span" onClick={this.saveMetadata}>
                                    Save
                                </Button>
                            </Grid>
					
			);
		}
	
}

export default BulkMetadataUpload;