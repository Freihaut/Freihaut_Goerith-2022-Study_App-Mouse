/*
This file handles the tutorial, which is shown when the app is first started after installation
and optionally when the participant wants to see it again by clicking on the info option on tray icon
 */

// import the self-report question component and the mouse task component
import SelfReport from "./SelfReport";
import MouseTask from "./MouseTask";

import React, { Component } from 'react';


export default class DataGrabber extends Component {

    constructor(props) {
        super(props);

        this.state = {
            phase: "mouseTask"
        }

        this.grabbedData = {}
    }


    // switch from the mouseTask to the Self Report
    endMouseTask(data) {

        // add the mouse data to the grabbed data dictionary
       Object.assign(this.grabbedData, data);

        this.setState({phase: "selfReport"});
    }

    // end the DataGrabber and log the grabbed Data
    endGrabber(data) {
        // add the self-report data to the mouse data
        Object.assign(this.grabbedData, data);

        // send the grabbed Data to the parent component in the props
        this.props.endDataGrabber(this.grabbedData);
    }

    render() {

        return(
            <div style={{display: "flex", alignItems: "center", height: "100vh"}}>
                <div style={{margin: "auto"}}>
                        {this.state.phase === "mouseTask" ? <MouseTask intro={false} endTask={(data) => this.endMouseTask(data)}
                                                                       zoom={this.props.zoom}
                                                                       mouseTaskSize={this.props.mouseTaskSize}/>
                            :
                            this.state.phase === "selfReport" ? <SelfReport intro={false}
                                                                            buttonText={"Eingabe abschließen"}
                                                                            endReport={(e) => this.endGrabber(e)}
                                                                            zoom={this.props.zoom}/>
                                : null}
                </div>
            </div>
        )
    }

}