import React from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import UploadContent from './upload_content';
import FileListComponent from './file_list_component';
import {buildMapFromArray} from './utils';
import {APP_URLS} from "./url";
import axios from 'axios';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
});


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
            content: null
        };
        this.setCurrentView = this.setCurrentView.bind(this);
        this.tagIdTagsMap = {};
        this.handleFileDelete = this.handleFileDelete.bind(this);
        this.saveContentCallback = this.saveContentCallback.bind(this);
        this.uploadNewFile = this.uploadNewFile.bind(this);
        this.handleContentEdit = this.handleContentEdit.bind(this);
    }

    componentDidMount() {
        this.loadData()
    }
    buildTagIdTagsMap(tags) {
        // Builds a map of <Tag Id> - Tag
        const tagIdTagMap = {};
        Object.keys(tags).forEach(eachKey => {
            tagIdTagMap[eachKey] = buildMapFromArray(tags[eachKey], 'id');
        });
        return tagIdTagMap;
    }
    loadData() {
        const currInstance = this;
        axios.get(APP_URLS.ALLTAGS_LIST, {
            responseType: 'json'
        }).then(function (response) {
            currInstance.tagIdTagsMap=currInstance.buildTagIdTagsMap(response.data);
            console.log(currInstance.tagIdTagsMap);
            currInstance.setState({
                tags: response.data
            })
        }).catch(function (error) {
            console.log(error);
            // TODO : Show the error message.
        });
        axios.get(APP_URLS.CONTENTS_LIST, {
            responseType: 'json'
        }).then(function (response) {
            currInstance.setState({
                files: response.data
            })
        }).catch(function (error) {
            console.log(error);
            // TODO : Show the error message.
        });
    }
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
    setCurrentView(viewName){
        this.setState({currentView: viewName})
    }
    handleFileDelete(file){
        this.setState((prevState, props)=>{
            const {files} = prevState;
            files.forEach(eachFile => {
                if (eachFile.id===file.id){
                    files.splice(files.indexOf(eachFile), 1)
                }
            });
            return {files};
        })
    }
    saveContentCallback(content, updated){
        this.setState((prevState, props)=>{
            const {files} = prevState;
            if (updated){
                files.forEach(eachFile => {
                if (eachFile.id===content.id){
                    files.splice(files.indexOf(eachFile), 1, content);
                }
            });
            }
            else{
                files.push(content);
            }

            return {
                currentView: 'manage',
                files
            };
        })
    }
    uploadNewFile(){
        this.setState({
            currentView: 'upload',
            content: {
                id: -1,
                name: "",
                description: "",
                creators: [],
                coverages: [],
                subjects: [],
                keywords: [],
                workareas: [],
                languages: [],
                catalogers: [],
                updatedDate: new Date(),
                source: "",
                copyright: "",
                rightsStatement: "",
                originalFileName: ""
            }
        })
    }
    handleContentEdit(content){
        console.log(content)
        this.setState({
            currentView: 'upload',
            content: {
                id: content.id,
                name: content.name,
                description: content.description,
                creators: content.creators||[],
                coverages: content.coverage?[content.coverage]:[],
                subjects: content.subjects||[],
                keywords: content.keywords||[],
                workareas: content.workareas||[],
                languages: content.language?[content.language]:[],
                catalogers: content.cataloger?[content.cataloger]:[],
                updatedDate: content.updatedDate,
                source: content.source,
                copyright: content.copyright,
                rightsStatement: content.rightsStatement,
                originalFileName: content.originalFileName,
            }
        })
    }
    render(){
        return (
            <div>
                <Grid container spacing={8} style={{paddingLeft: '20px'}}>
                    <Grid item xs={3} style={{paddingLeft: '20px'}}>
                        <h3>Content Management</h3>
                        <Button variant="raised" color="primary" onClick={e => {this.setCurrentView('manage')}}>
                            Manage Content
                        </Button>
                        <div style={{marginTop: '20px'}}> </div>
                        <Button variant="raised" color="primary" onClick={e => {this.uploadNewFile()}}>
                            Add Content
                        </Button>
                    </Grid>

                    <Grid item xs={8}>
                        {this.state.currentView=='manage'&&<FileListComponent onEdit={this.handleContentEdit} onDelete={this.handleFileDelete} allFiles={this.state.files} tagIdsTagsMap={this.tagIdTagsMap} />}
                        {this.state.currentView=='upload'&&<UploadContent onSave={this.saveContentCallback} tagIdsTagsMap={this.tagIdTagsMap} allTags={this.state.tags} content={this.state.content}/>}
                    </Grid>
                </Grid>

            </div>
        )
    }
}
module.exports = ContentManagement;