import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
/*
* Constructor for DownloadBuild
*/
class DownloadBuild extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            name: props.build.name,
            currTime: props.build.currTime,
            download: props.build.download
        };
    }
    /*
    * Load all the data
    */
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            name: props.build.name,
            currTime: props.build.currTime,
            download: props.build.download
        });
    }
    /*
    * Render the download page
    */
    render(){

        return(
            <div>
                <label>Name</label>
                <TextField
                  id="name"
                  value={this.state.name || ''}
                  fullWidth
                  margin="normal"
                />

                <label>Date Created</label>
                <TextField
                  id="time"
                  fullWidth
                  value={this.state.currTime || ''}
                  margin="normal"
                />
                <Button variant="contained" color="primary" onClick={evt => window.open(this.state.download, "_blank")}>
                    Download Image
                </Button>
            </div>
        )
    }

}

export default DownloadBuild;
