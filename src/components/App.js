import React, {Component} from 'react';
import bulma from 'bulma/css/bulma.css';
const {ipcRenderer} = require("electron");


import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

import Tutorial from "./Tutorial";
import DataGrabber from "./DataGrabber";
import ReshowAppInfo from "./ReshowAppInfo"
import StudyEnd from "./StudyEnd";

export default class App extends Component {

    constructor(props) {
        super(props);

        // initialize Firebase
        var firebaseConfig = {
            apiKey: "AIzaSyDPmlCWKy4wn6gIf-7O-hBP7L6G9K1vZuE",
            authDomain: "longitudinal-study21.firebaseapp.com",
            databaseURL: "https://longitudinal-study21-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "longitudinal-study21",
            storageBucket: "longitudinal-study21.appspot.com",
            messagingSenderId: "709694742372",
            appId: "1:709694742372:web:a990a8565bd535ef95a471",
        };

        firebase.initializeApp(firebaseConfig);

        this.state = {
            page: null,
            userId: undefined,
            zoom: 1,
            online: false
        }

        // listen to the message from the main process that tells the renderer process which page to load and
        // which windows zoom level the participant uses (in addition to other screen related infos)
        ipcRenderer.once("appPageToRender", (event, page, displayInfo) => {
            this.displayInfo = displayInfo;
            this.setState({page: page, zoom: displayInfo.zoom});
        })
    }

    componentDidMount() {

        // log into firebase anonymously and set the userId state to the firebase user id
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(function () {
                return firebase.auth().signInAnonymously();
            })
            .catch(function (error) {
                let errorCode = error.code;
                let errorMessage = error.message;
                // console.log(errorCode, errorMessage)
            });

        // if the user successfully logged in, set the user id to the state
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                //console.log("User signed in with user ID: " + user.uid);
                this.setState({userId: user.uid});
                // check if there is locally saved data that hasnt been pushed to firebase yet (e.g. because the user was offline)
                const storage = {...localStorage};
                // loop the data from the local storage
                for (const [key, value] of Object.entries(storage)) {
                    if (!key.includes("firebase")) {
                        firebase.database().ref(user.uid).push(JSON.parse(value), (error) => {
                            // put the close window in the callback function?
                            if (error) {
                                // dont do anything
                                // console.log("Could not save file " + key);
                            } else {
                                // if the data was saved successfully delete the locally saved datafile
                                // console.log("File " + key + " successfully saved in firebase");
                                window.localStorage.removeItem(key);
                                // console.log("Locally saved file " + key + " was successfully removed");
                            }
                        });
                    }
                }
            } else {
                // User is signed out
                // Do nothing
            }
        });

        // check if the user is online or offline (required to determine if sending data into the database if possible
        // if the user is offline, firebase tries to resent the data until a connection is established, which causes
        // the app to fail closing the browser window at the end of the tutorial/data collection (where data is sent to
        // firebase
        const connectedRef = firebase.database().ref(".info/connected");

        connectedRef.on("value", (snap) => {
            if (snap.val() === true) {
                // set online state if the user is online
                this.setState({online: true})
            } else {
                // set offline state if the user is offline
                this.setState({online: false})
            }
        });

    }

    // Define functions that do the data handling when the user is done with the tutorial or data logger

    // end of tutorial (when the user finishes the tutorial, save the sociodemographic data and "start" the data logging
    endTutorial(tutData) {

        // get the tutorial data (sociodemographics) and send them to firebase when the tutorial is done
        // check if the user logged into firebase and check if the user is online or offline
        if (this.state.userId && this.state.online) {
            firebase.database().ref(this.state.userId).push(tutData, (error) => {
                // put the close window in the callback function?
                if (error) {
                    // Data Save error --> save the data locally and end the tutorial
                    this.saveDataLocally(tutData); // disabled in test version
                    ipcRenderer.send("tutorialEnd");
                } else {
                    // Data saved successfully in firebase
                    ipcRenderer.send("tutorialEnd");
                }
            });
        } else {
            // if the login was not successful or the user is offline when trying to send the data
            // send the data into the main process to save it locally and end the tutorial
            this.saveDataLocally(tutData); //disabled in test version
            ipcRenderer.send("tutorialEnd");
        }

    }

    // handle the end of the data grabbing
    endDataGrabber(grabberData) {

        // get the mouse data from the mouse task, the self report data and the main process mouse data (which is saved
        // in the grabberData, add the timestamp when the data was saved and the zoom level
        const grabbedData = {"grabbedData": {...grabberData, ...{"time": Date.now()}, ...{disInf: this.displayInfo}}};

        // check if the user has an id and check if the user is offline or online
        if (this.state.userId && this.state.online) {
            firebase.database().ref(this.state.userId).push(grabbedData, (error) => {
                // put the close window in the callback function?
                if (error) {
                    // Data Save error --> Save the data locally
                    this.saveDataLocally(grabbedData); // disabled in test version
                    // close the logger window
                    ipcRenderer.send("close");
                } else {
                    // The data was successfully saved in firebase
                    ipcRenderer.send("close");
                }
            });
        } else {
            // if the login was not successful or if the user is offline save the data locally and close the window
            this.saveDataLocally(grabbedData); // disabled in test version
            ipcRenderer.send("close");
        }

    }

    // helper function to save data locally
    saveDataLocally(data) {

        // get a timestamp to give the data to save a name
        const saveString = Date.now();

        // save the data file locally as a string in the browser local storage
        window.localStorage.setItem(saveString.toString(), JSON.stringify(data));
        // console.log("File was saved locally with the save string " + saveString.toString());
    }

    // UI Dev functions

    // For UI Development only: Create a startpage to switch between the tutorial and the Data Grabber
    /*
    setPage(page) {

        this.setState({
            page: page
        })
    }
    */

    // For UI Development
    /*
    renderStartPage() {
        return(
            <div style={{display: "flex", alignItems: "center", height: "100vh"}}>
                <div style={{margin: "auto"}}>
                    <div className="field">
                        <h3>Select the pages you want to see</h3>
                    </div>
                    <div className="field is-grouped">
                        <div className="control">
                            <button className="button is-link" onClick={() => this.setPage("tutorial")}>Start Tutorial</button>
                        </div>
                        <div className="control">
                            <button className="button is-link" onClick={() => this.setPage("logger")}>Start Logger</button>
                        </div>
                        <div className="control">
                            <button className="button is-link" onClick={() => this.setPage("reshowTut")}>Start App-Info</button>
                        </div>
                        <div className="control">
                            <button className="button is-link" onClick={() => this.setPage("studyEnd")}>Start StudyEnd</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    */

    // to here (plus the navbar and the renderstartpage in the render function

    render() {
        return (

            <div>
                {/*<nav className="navbar is-fixed-bottom">
                    <a className="navbar-item" onClick={() => this.setPage("start")}>
                        Go to Debug Page
                    </a>
                </nav>*/}
                {
                    /*this.state.page === "start" ? this.renderStartPage() : */
                    this.state.page === "tutorial" ? <Tutorial endTutorial={(data)=> this.endTutorial(data)}
                                                               zoom={this.state.zoom}
                                                               mouseTaskSize={this.displayInfo.windBounds.width}/> :
                        this.state.page === "logger" ? <DataGrabber endDataGrabber={(data) => this.endDataGrabber(data)}
                                                                    zoom={this.state.zoom}
                                                                    mouseTaskSize={this.displayInfo.windBounds.width}/> :
                            this.state.page === "reshowTut" ? <ReshowAppInfo zoom={this.state.zoom}
                                                                             mouseTaskSize={this.displayInfo.windBounds.width}/> :
                                this.state.page === "studyEnd" ? <StudyEnd zoom={this.state.zoom}/>
                                    : null
                }
            </div>
        );
    }

}