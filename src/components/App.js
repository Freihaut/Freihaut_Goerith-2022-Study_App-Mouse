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
import Login from "./LoginPage";

export default class App extends Component {

    constructor(props) {
        super(props);

        // initialize Firebase
        //TODO: Changed Config to a test Firebase Project
        const firebaseConfig = {
            apiKey: "AIzaSyCO0IdxZEGms4ve6cdmzSDDgaYeCRQI7aA",
            authDomain: "test-project-c54c0.firebaseapp.com",
            projectId: "test-project-c54c0",
            storageBucket: "test-project-c54c0.appspot.com",
            messagingSenderId: "1041378300647",
            appId: "1:1041378300647:web:863ad64eac44eb8e4b4842",
            databaseURL: "https://test-project-c54c0-default-rtdb.europe-west1.firebasedatabase.app"
        };


        firebase.initializeApp(firebaseConfig);

        // check if there is a participant ID in the local storage
        let dataSaveId = window.localStorage.getItem('participantID');
        // if there is no participant ID, create a participantId and save it in the local storage
        if (!dataSaveId) {
            const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            dataSaveId = [...Array(10)].map(_ => alphabet[~~(Math.random()*alphabet.length)]).join('')
            window.localStorage.setItem("participantID", dataSaveId);
        }

        this.state = {
            page: null,
            userId: undefined,
            online: false,
            callingFirebase: false,
            fireBaseCallFails: false,
            dataSaveId: dataSaveId,
            mouseTaskSize: null,
            // check if the current date is after the study end date, if no, check if the participant has already seen the participation credit page
            // "Hack" in the control condition --> endPage is set to true to always show the endPage (dirty solution)
            endPage: true,
        }

        // listen to the message from the main process that tells the renderer process which page to load and
        // which windows zoom level the participant uses (in addition to other screen related infos) and the user Id for the end of the study
        ipcRenderer.once("appPageToRender", (event, page, displayInfo) => {
            this.displayInfo = displayInfo;
            this.setState({page: page, mouseTaskSize: displayInfo.windBounds.width});
        })

        // listens to a resize event of the browser window and chnaged the mouse task size + additionally logs the
        // information
        ipcRenderer.on("resizedWindow", (event, size) => {
            this.setState({mouseTaskSize: size});
            this.displayInfo = {...this.displayInfo, ...{resized: {newSize: size, date: Date.now()}}}
        })
    }

    componentDidMount() {

        // Set the auth persistence on login to Local to keep the user logged into the app unless the user delets the
        // local app data
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

        // if the user successfully logged in, set the user id to the state
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                // console.log("User signed in with user ID: " + user.uid);
                // save the info that the user has logged in, unless the study is over, then only show the last page
                this.setState({userId: user.uid, fireBaseCallFails: false, callingFirebase: false}, () => {firebase.database().ref("userData/" + user.uid).update({"loggedIn": true})});
                // check if there is locally saved data that hasnt been pushed to firebase yet (e.g. because the user was offline)
                const storage = {...localStorage};
                // loop the data from the local storage
                for (const [key, value] of Object.entries(storage)) {
                    // only save the study data from the local storage, not any other data that is saved in the local storage
                    if ((!key.includes("firebase")) && (key !== "endPage") && (key !== "participantID")) {
                        firebase.database().ref("studyData/" + this.state.dataSaveId).push(JSON.parse(value), (error) => {
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

                // if the user reached the end page, save that the user finished the study
                if (this.state.page === "studyEnd") {
                    firebase.database().ref("userData/" + user.uid).update({"finishedStudy": true})
                }

            } else {
                // User is signed out, give him a bad user id, unless the study is already over, then prevent from
                // showing the login page
                this.setState({userId: -99})
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
                this.setState({online: true});
            } else {
                // set offline state if the user is offline
                this.setState({online: false});
            }
        });
    }

    // function that logs into the App (and shows an error message if the login is not successful
    appLogin(id, password) {

        // disable the login button until the logging is completed (or fails)
        this.setState({fireBaseCallFails: false, callingFirebase: true}, () => {

            // add a "loading timeout" of 400ms to visualize that the user clicked a button and the app is working
            setTimeout(()=> {
                firebase.auth().signInWithEmailAndPassword(id, password).catch((error) => {
                    if (error) {
                        this.setState({fireBaseCallFails: true, callingFirebase: false});
                    }
                })
            }, 400)
            })
    }

    // Define functions that do the data handling when the user is done with the tutorial or data logger

    // end of tutorial (when the user finishes the tutorial, save the sociodemographic data and "start" the data logging
    endTutorial(tutData) {

        // add the version number to the tut data to keep track of potential changes in the study app version
        const studyStartData = {...tutData, ...{appVersion: "Panel_Pilot_0Econd"}, ...{"os": process.platform}}

        // get the tutorial data (sociodemographics) and send them to firebase when the tutorial is done
        // check if the user logged into firebase and check if the user is online or offline
        if (this.state.userId && this.state.online) {
            firebase.database().ref("studyData/" + this.state.dataSaveId).push(studyStartData, (error) => {
                // put the close window in the callback function?
                if (error) {
                    // Data Save error --> save the data locally and end the tutorial
                    this.saveDataLocally(studyStartData); // disabled in test version
                    ipcRenderer.send("tutorialEnd");
                } else {
                    // Data saved successfully in firebase
                    ipcRenderer.send("tutorialEnd");
                }
            });
        } else {
            // if the login was not successful or the user is offline when trying to send the data
            // send the data into the main process to save it locally and end the tutorial
            this.saveDataLocally(studyStartData); //disabled in test version
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
            firebase.database().ref("studyData/" + this.state.dataSaveId).push(grabbedData, (error) => {
                // put the close window in the callback function?
                if (error) {
                    // Data Save error --> Save the data locally
                    this.saveDataLocally(grabbedData); // disabled in test version
                    // close the logger window
                    ipcRenderer.send("close");
                } else {
                    // If the data was successfully saved in firebase, notify that the participant participated in data collection
                    firebase.database().ref("userData/" + this.state.userId).update({"dataWasLogged": true}, () => {
                            // close the logger window
                            ipcRenderer.send("close");
                    })
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

    // save the participation credit when the user reaches the end of the study
    saveParticipationCredit(bool) {

        // disable the data saving button until the saving completes or fails
        this.setState({fireBaseCallFails: false, callingFirebase: true}, () => {

            // add a "loading timeout" of 400ms to visualize that the user clicked a button and the app is working
            setTimeout(()=> {
                if (this.state.userId && this.state.online) {
                    // save the participant Info about the study credit in the database
                    firebase.database().ref("userData/" + this.state.userId).update({"donatesBack": bool}, (error) => {
                        if (error) {
                            // could not save the data, show a warning
                            this.setState({fireBaseCallFails: true, callingFirebase: false})
                        } else {
                            // show the last page and save the information that the user already received the study credit in the localStorage
                            this.setState({endPage: true, fireBaseCallFails: false, callingFirebase: false}, () => {
                                window.localStorage.setItem("endPage", "true");
                            })
                        }
                    })
                } else {
                    // not connected to the internet, show a warning
                    this.setState({fireBaseCallFails: true, callingFirebase: false})
                }
            }, 400)

        })

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
                    /* Show a blank screen until it is decided if the user is logged in, if the user is logged in
                    * show the study page, else show the login screen */
                    this.state.userId ?
                        this.state.userId === -99 ?
                            <Login badLogin={this.state.fireBaseCallFails}
                                   loginAttempt={this.state.callingFirebase}
                                   logIn={(id, pw) => this.appLogin(id, pw)}/> :
                            this.state.page === "tutorial" ? <Tutorial endTutorial={(data)=> this.endTutorial(data)}
                                                                       mouseTaskSize={this.state.mouseTaskSize}/> :
                                this.state.page === "logger" ? <DataGrabber endDataGrabber={(data) => this.endDataGrabber(data)}
                                                                            mouseTaskSize={this.state.mouseTaskSize}/> :
                                    this.state.page === "reshowTut" ? <ReshowAppInfo mouseTaskSize={this.state.mouseTaskSize}/> :
                                        this.state.page === "studyEnd" ? <StudyEnd endPage={this.state.endPage}
                                                                                   savingAttempt={this.state.callingFirebase}
                                                                                   savingFailed={this.state.fireBaseCallFails}
                                                                                   collectCredit={(bool) => this.saveParticipationCredit(bool)}/>
                                            : null
                        : null
                }
            </div>
        );
    }

}