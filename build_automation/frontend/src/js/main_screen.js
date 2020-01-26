import React from 'react';

import DirectoryLayoutComponent from './directory_layout.js';
import ContentManagement from './content_management.js';
import DiskSpace from './diskspace.js';
import TagManagementComponent from './tag_management';

import BuildProcessComponent from './build_process.js';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import {APP_URLS} from "./url";
import axios from 'axios';

//this is the old logo
//import solarSpellLogo from '../images/logo.png';

//this is the new logo (logo2)
import solarSpellLogo from '../images/logo2.png'; 
import '../css/style.css';
import HomeScreen from './home_screen.js';



const newPalette = createMuiTheme({
	palette: {
		primary: {
		  main: '#75B2DD',
		  dark: '#75B2DD',
		  contrastText: '#FFFFFF'
		},
		secondary: {
		  main: '#FFFFFF'
		}
      }
});	

const styles = theme => ({
    padding: {
		padding: `0 ${theme.spacing(2)}px`,
	},
	indicator: {
		color: '#75B2dd',
		fontSize: '22px',
		fontWeight: 'bold',
		fontFamily: 'Asap',
	},
	head: {
		color: '#75B2dd',
		fontSize: '18px',
		fontWeight: 'bold',
		fontFamily: 'Asap',
	
	}
	/* palette: {
		primary: {
		  light: orange[200], // same as '#FFCC80',
		  main: '#FB8C00', // same as orange[600]
		  dark: '#EF6C00',
		  contrastText: 'rgb(0,0,0)'
		},
		secondary: {
		  main: '#75B2DD'
		}
	} */
});

/*
* Main screen constructor
*/

class MainScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 'home',
            showBadge: false
        };
        this.handleTabClick = this.handleTabClick.bind(this);
        this.change_tab = this.change_tab.bind(this);
    }
    /*
    * Event for switching tabs
    */
    handleTabClick(event, selectedTab) {
        this.setState({ currentTab: selectedTab });
      };
    /*
    * Call showBadge method
    */
    componentDidMount() {
        this.showBadge();
        this.timerID = setInterval(
            () => this.showBadge(),1000*60*60
        );
    }
    /*
    * Clear
    */
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    /*Load axios items(diskspace)*/
    showBadge() {
        axios
            .get(APP_URLS.DISKSPACE, {responseType: 'json'})
            .then((response) => {
                this.used = 100*(response.data.total_space-response.data.available_space)/response.data.total_space
                const newState = ({completed: 100*(response.data.total_space-response.data.available_space)/response.data.total_space, showBadge: false});
                if(newState.completed > 80) {
                    newState.showBadge= true
                }
                this.setState(newState)
            })
            .catch((error) => {
                console.error(error);
                // TODO : Show the error message.
            });
    }
    change_tab(tab_name) {
        this.setState({
            currentTab: tab_name
        })
    }
    /*
    * Render main screen
    */
    render() {
        const currentTab = this.state.currentTab;
        const { classes } = this.props;

        return (
            <React.Fragment>
			<MuiThemeProvider theme={newPalette}>
            <Grid container style={{backgroundColor: '#ffffff', height: '150px', flexGrow: 1, overflow: 'hidden'}} justify="center">
                <Grid item xs={12}>
                    <Grid container justify="center" alignItems="center" style={{height: '100%'}}>
                        <Tabs
                            value={currentTab}
                            TabIndicatorProps={{style: {backgroundColor: '#75B2DD', height: '5px', borderRadius: '5px'}}}
                            onChange={this.handleTabClick}
                            centered
                            indicatorColor="secondary"
                        >
                            <Tab className={classes.indicator} value="home" label={<img src={solarSpellLogo} className="spellLogo" />} />
                            <Tab className={classes.indicator} value="tags" label="Metadata" />
                            <Tab className={classes.indicator} value="contents" label="Contents" />
                            <Tab className={classes.indicator} value="dirlayout" label="Library Versions" />
                            <Tab className={classes.indicator} value="images" label="SolarSPELL Images" />
                            {
                                this.state.showBadge ?
                                (
                                    <Tab
                                        className={classes.indicator}
                                        value="sysinfo"
                                        label={
                                            <Badge className= {classes.padding} color="secondary" badgeContent={'!'}>
                                                System Info
                                            </Badge>
                                        }
                                    />
                                ) : (
                                    <Tab className={classes.indicator} value="sysinfo" label="System Info" />
                                )
                            }
                        </Tabs>
                    </Grid>
                </Grid>
            </Grid>
            
            <Grid container style={{marginTop: '20px'}}>
                <Grid item xs={12}>
                    {currentTab == 'home' && <HomeScreen change_tab={this.change_tab} />}
                    {currentTab == 'dirlayout' && <DirectoryLayoutComponent />}
                    {currentTab == 'contents' && <ContentManagement />}
                    {currentTab == 'tags' && <TagManagementComponent/>}
                    {currentTab == 'images' && <BuildProcessComponent />}
                    {currentTab == 'sysinfo' && <DiskSpace/>}
                </Grid>
            </Grid>
			</MuiThemeProvider>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(MainScreen);
