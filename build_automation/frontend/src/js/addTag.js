import axios from 'axios';
import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';

import Typography from '@material-ui/core/Typography';
import { TAG_SAVE_TYPE, HTTP_STATUS } from './constants.js';
/*
* Constructor for new tags
*/
class TagCreation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.tag.id,
            name: props.tag.name,
            description: props.tag.description
        };
        this.handleTextFieldUpdate = this.handleTextFieldUpdate.bind(this);
        this.saveTag = this.saveTag.bind(this);
        this.saveCallback = props.onSave.bind(this);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    }
    /*
    * This method handles changes made to fields in metadata files
    */
    handleTextFieldUpdate(stateProperty, evt) {
        this.setState({
            [stateProperty]: evt.target.value
        })
    }
    /*
    * General error class
    */
    getErrorClass() {
        return this.state.messageType === "error" ? { backgroundColor: '#B71C1C', fontWeight: 'normal' } : {};
    }

    /*
    * A method to populate the files data
    */
    UNSAFE_componentWillReceiveProps(props) {

        this.setState({
            name: '',
            description: ''

        });
    }
    /*
    * Method to either update or create a new piece of metadata
    */
    saveTag(evt) {
        var targetUrl = this.props.listUrl;
        const payload = { name: this.state.name, description: this.state.description };
        const currentInstance = this;
        if (this.state.id > 0) {
            // Update an exising Tag.
            targetUrl = (this.props.detailUrl, { id: this.state.id });
            axios.patch(targetUrl, payload, {
                responseType: 'json'
            }).then(function (response) {
                currentInstance.saveCallback(response.data, TAG_SAVE_TYPE.UPDATE);
            }).catch(function (error) {
                console.error("Error in updating the tag.", error);
                console.error(error.response.data);
                const errorMsg = 'Error in creating the tag.';
                //Handle bad requests
            if (error.response.status === HTTP_STATUS.BAD_REQUEST) {
                errorMsg = (<React.Fragment><b>ERROR:</b> This metadata already exists. Please rename it before trying to update.</React.Fragment>);
            }
                currentInstance.setState({
                    message: errorMsg,
                    messageType: 'error'
                });
            })
        }
        else {
            // Create a new Tag.
            axios.post(targetUrl, payload, {
                responseType: 'json'
            }).then(function (response) {
                currentInstance.saveCallback(response.data, TAG_SAVE_TYPE.CREATE);
            }).catch(function (error) {
                console.error("Error in creating a new Tag", error);
                console.error(error.response.data);
                const errorMsg = 'Error in creating the tag.';
                //Handle bad requests
            if (error.response.status === HTTP_STATUS.BAD_REQUEST) {
                errorMsg = (<React.Fragment><b>ERROR:</b> This metadata already exists. Please rename it before trying to add.</React.Fragment>);
            }
                currentInstance.setState({
                    message: errorMsg,
                    messageType: 'error'
                });
            })


        }
    }

    /*
    * Render class for the add metadata screen
    */
    render() {
        return (
            <Grid container spacing={0} style={{ paddingLeft: '20px' }}>
                <Grid item xs={8}>
                    <Button variant="contained" color="primary" onClick={e => { this.props.onCancel() }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={evt => this.saveTag(evt)}>
                        Save
                    </Button>
                </Grid>
                <Grid item xs={8}>
                    <Typography gutterBottom align="center" variant="h5" component="h2">
                        {this.props.title}
                    </Typography>
                </Grid>
                <Grid item xs={8}>

                    <TextField
                        id="name"
                        label="Name"
                        value={this.state.name}
                        onChange={evt => this.handleTextFieldUpdate('name', evt)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        id="desc"
                        label="Description"
                        value={this.state.description}
                        onChange={evt => this.handleTextFieldUpdate('description', evt)}
                        fullWidth
                        margin="normal"
                    />
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

            </Grid>
        );

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

export default TagCreation;
